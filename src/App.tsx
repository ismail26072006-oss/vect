import React, { useState, useEffect, useRef } from 'react';
import { 
  UserProfile, 
  UserRole, 
  CourseSchedule, 
  TaskItem, 
  NavPage, 
  ClassInfo, 
  ToastNotification 
} from './types';
import { initialUser, initialSchedules, initialTasks } from './data/initialData';
import { LoginScreen } from './components/LoginScreen';
import { ClassGateScreen } from './components/ClassGateScreen';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { BiodataView } from './components/BiodataView';
import { TambahBiodataView } from './components/TambahBiodataView';
import { AnggotaKelasView } from './components/AnggotaKelasView';
import { ToastContainer } from './components/ToastContainer';
import {
  subscribeToClassTasks,
  subscribeToClassSchedules,
  syncAddTask,
  syncUpdateTask,
  syncDeleteTask,
  syncToggleTask,
  syncToggleTaskForUser,
  syncAddSchedule,
  syncDeleteSchedule,
  DEFAULT_CLASS_INFO,
  isNimAllowedInClass,
  recordClassMember
} from './services/firebaseSyncService';

// Auto-reset all data on first load to pristine clean state
const SYSTEM_WIPE_VERSION = '2026_10_31_clean_final_v10';
if (typeof window !== 'undefined') {
  if (localStorage.getItem('siakad_clean_version') !== SYSTEM_WIPE_VERSION) {
    try {
      localStorage.clear();
      localStorage.setItem('siakad_clean_version', SYSTEM_WIPE_VERSION);
    } catch (e) {}
  }
}

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('siakad_logged_in_v2');
    return saved !== null ? saved === 'true' : false;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('siakad_user_v2');
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [currentClass, setCurrentClass] = useState<ClassInfo | null>(() => {
    const saved = localStorage.getItem('siakad_active_class_v2');
    return saved ? JSON.parse(saved) : null;
  });

  const [schedules, setSchedules] = useState<CourseSchedule[]>(() => {
    try {
      const saved = localStorage.getItem('siakad_schedules_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((s: CourseSchedule) => !s.id.startsWith('mk-') || s.id.length > 8);
        }
      }
    } catch (e) {}
    return [];
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('siakad_tasks_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Remove old ghost tasks (e.g. task-1, task-2, UI/UX Portal)
          return parsed.filter((t: TaskItem) => 
            !['task-1', 'task-2', 'task-3', 'task-4', 'task-5', 'task-6'].includes(t.id) &&
            !t.title.includes('UI/UX Portal') &&
            !t.title.includes('Query SQL')
          );
        }
      }
    } catch (e) {}
    return [];
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [notifiedTaskIds, setNotifiedTaskIds] = useState<Set<string>>(new Set());

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('siakad_logged_in_v2', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('siakad_user_v2', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    if (currentClass) {
      localStorage.setItem('siakad_active_class_v2', JSON.stringify(currentClass));
    } else {
      localStorage.removeItem('siakad_active_class_v2');
    }
  }, [currentClass]);

  useEffect(() => {
    localStorage.setItem('siakad_schedules_v2', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('siakad_tasks_v2', JSON.stringify(tasks));
  }, [tasks]);

  // Request browser notification permission once
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, []);

  // Firebase Real-time Synchronization
  useEffect(() => {
    if (!isLoggedIn || !currentClass?.code) return;

    // Real-time listener for tasks: Maps per-student completion status
    const studentNim = currentUser.nim;
    const unsubscribeTasks = subscribeToClassTasks(
      currentClass.code,
      (updatedTasks) => {
        const mapped = updatedTasks.map((t) => {
          const isDone = Array.isArray(t.completedByNims)
            ? t.completedByNims.includes(studentNim)
            : false;
          return {
            ...t,
            isCompleted: isDone
          };
        });
        setTasks(mapped);
      },
      []
    );

    // Real-time listener for schedules
    const unsubscribeSchedules = subscribeToClassSchedules(
      currentClass.code,
      (updatedSchedules) => {
        setSchedules(updatedSchedules);
      },
      []
    );

    return () => {
      unsubscribeTasks();
      unsubscribeSchedules();
    };
  }, [isLoggedIn, currentClass?.code, currentUser.nim]);

  // Notification Scheduling System: checks task due dates and triggers notifications for tasks due within <= 1 hour
  useEffect(() => {
    const checkUpcomingDeadlines = () => {
      const now = new Date();

      tasks.forEach((task) => {
        if (task.isCompleted) return;
        if (!task.dueDate) return;

        // Parse due date and due time (default to 23:59 if no time specified)
        const timePart = task.dueTime || '23:59';
        const [yearStr, monthStr, dayStr] = task.dueDate.split('-');
        const [hourStr, minStr] = timePart.split(':');

        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10) - 1;
        const day = parseInt(dayStr, 10);
        const hour = parseInt(hourStr || '23', 10);
        const min = parseInt(minStr || '59', 10);

        if (isNaN(year) || isNaN(month) || isNaN(day)) return;

        const dueDateTime = new Date(year, month, day, hour, min, 0);
        const diffMs = dueDateTime.getTime() - now.getTime();
        const diffMinutes = Math.round(diffMs / (60 * 1000));

        // Check if task is due within the next hour (0 < diffMinutes <= 60)
        if (diffMinutes > 0 && diffMinutes <= 60) {
          if (!notifiedTaskIds.has(task.id)) {
            setNotifiedTaskIds((prev) => new Set(prev).add(task.id));

            // Browser Notification
            if (
              typeof window !== 'undefined' &&
              'Notification' in window &&
              Notification.permission === 'granted'
            ) {
              try {
                new Notification(`⚠️ Pengingat Tugas: ${task.title}`, {
                  body: `Mata kuliah: ${task.courseName}. Tenggat berakhir dalam ${diffMinutes} menit!`,
                  icon: '/assets/logo_sigma.png'
                });
              } catch (e) {
                console.warn('Browser notification trigger failed:', e);
              }
            }

            // In-App Toast Notification
            const newToast: ToastNotification = {
              id: 'toast-' + Date.now() + '-' + task.id,
              title: '⚠️ Peringatan Tenggat Tugas Mendatang!',
              message: `Tugas "${task.title}" (${task.courseName}) jatuh tempo dalam ${diffMinutes} menit lagi.`,
              type: 'urgent',
              timestamp: Date.now(),
              taskId: task.id
            };

            setNotifications((prev) => [newToast, ...prev.slice(0, 4)]);
          }
        }
      });
    };

    // Run immediately and then poll every 30 seconds
    checkUpcomingDeadlines();
    const interval = setInterval(checkUpcomingDeadlines, 30000);
    return () => clearInterval(interval);
  }, [tasks, notifiedTaskIds]);

  // Auth & Class Handlers
  const handleLogin = (role: UserRole, enteredNim: string, studentName?: string) => {
    const trimmedNim = enteredNim.trim() || '04102425006';
    
    // Check if we have registered student details in database
    let resolvedName = studentName;
    try {
      const savedStudents = localStorage.getItem('siakad_registered_students');
      if (savedStudents) {
        const parsed: UserProfile[] = JSON.parse(savedStudents);
        const match = parsed.find((s) => s.nim === trimmedNim);
        if (match && !resolvedName) {
          resolvedName = match.name;
        }
      }
    } catch (e) {}

    const updatedUser: UserProfile = {
      ...currentUser,
      nim: trimmedNim,
      role: role,
      name: resolvedName 
        ? resolvedName 
        : trimmedNim === '04102425006'
        ? 'ISMAIL K. ZAKARIA'
        : `Mahasiswa (${trimmedNim})`,
      email: `${trimmedNim}@mahasiswa.ung.ac.id`,
      classCode: undefined
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('siakad_user_v2', JSON.stringify(updatedUser));
    setIsLoggedIn(true);

    // Save to device logged accounts on this device only
    try {
      const savedAccounts = localStorage.getItem('siakad_device_logged_accounts');
      const accounts = savedAccounts ? JSON.parse(savedAccounts) : [];
      const updatedAccounts = [
        {
          nim: trimmedNim,
          name: updatedUser.name,
          role: role,
          prodi: 'S1 MATEMATIKA',
          fakultas: 'Universitas Negeri Gorontalo',
          angkatan: '2024',
          lastLogin: new Date().toISOString(),
          ktmImageUrl: '/assets/ktm_ismail.png'
        },
        ...accounts.filter((a: any) => a.nim !== trimmedNim)
      ];
      localStorage.setItem('siakad_device_logged_accounts', JSON.stringify(updatedAccounts));
    } catch (e) {}

    // Force Class Gate Screen after login so the user enters class code with the updated NIM
    setCurrentClass(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentClass(null);
  };

  /**
   * Enhanced handleClassJoined:
   * Validates personal NIM against the class's NIM Prefix and Range restriction.
   * If unauthorized, displays a toast warning and blocks entry.
   * If joining a newly created custom class, resets tasks & schedules to empty.
   */
  const handleClassJoined = (classInfo: ClassInfo) => {
    // 1. Validation check against NIM Prefix and NIM Range
    const nimCheck = isNimAllowedInClass(currentUser.nim, classInfo);
    if (!nimCheck.allowed) {
      const warningToast: ToastNotification = {
        id: 'toast-nim-unauthorized-' + Date.now(),
        title: '⛔ Peringatan: NIM Tidak Diizinkan',
        message: nimCheck.reason || `NIM Anda (${currentUser.nim}) tidak memenuhi syarat rentang NIM untuk kelas ${classInfo.name}. Hubungi Ketua Kelas untuk konfirmasi.`,
        type: 'urgent',
        timestamp: Date.now()
      };
      setNotifications((prev) => [warningToast, ...prev]);
      return;
    }

    // 2. Class content isolation:
    // If it's a newly created custom class, start with completely EMPTY schedules & tasks!
    if (classInfo.code !== currentClass?.code) {
      setSchedules([]);
      setTasks([]);
    }

    setCurrentClass(classInfo);
    setCurrentUser((prev) => ({ ...prev, classCode: classInfo.code }));

    // Record user as an active member of this class in Firebase
    recordClassMember(classInfo.code, {
      nim: currentUser.nim,
      name: currentUser.name,
      role: currentUser.role,
      prodi: currentUser.prodi,
      joinedAt: new Date().toISOString()
    });

    // Show success toast
    const successToast: ToastNotification = {
      id: 'toast-class-' + Date.now(),
      title: '🏫 Berhasil Masuk Ruang Kelas',
      message: `Terhubung ke kelas ${classInfo.name} (${classInfo.code}). Sinkronisasi Firebase real-time aktif.`,
      type: 'success',
      timestamp: Date.now()
    };
    setNotifications((prev) => [successToast, ...prev]);
  };

  const handleSwitchClass = () => {
    setCurrentClass(null);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role: newRole }));
  };

  // Task Handlers with real-time Firebase sync
  const handleAddTask = async (newTask: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const item: TaskItem = {
      ...newTask,
      id: 'task-' + Date.now(),
      createdAt: new Date().toISOString(),
      createdBy: currentUser.nim,
      completedByNims: [],
      isCompleted: false,
    };
    // Optimistic local update
    setTasks((prev) => [item, ...prev]);

    // Firestore sync
    if (currentClass?.code) {
      await syncAddTask(currentClass.code, item);
    }
  };

  const handleEditTask = async (updatedTask: TaskItem) => {
    // Optimistic local update
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));

    // Firestore sync
    if (currentClass?.code) {
      await syncUpdateTask(currentClass.code, updatedTask);
    }
  };

  const handleDeleteTask = async (id: string) => {
    // Optimistic local update
    setTasks((prev) => prev.filter((t) => t.id !== id));

    // Firestore sync
    if (currentClass?.code) {
      await syncDeleteTask(currentClass.code, id);
    }
  };

  /**
   * Per-Student Task Completion:
   * When a student checks a task, only their personal NIM is toggled in completedByNims.
   * Other students' checkboxes remain unaffected!
   */
  const handleToggleTask = async (id: string) => {
    const studentNim = currentUser.nim;
    let nextStatus = false;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const currentList = Array.isArray(t.completedByNims) ? t.completedByNims : [];
          const isDone = currentList.includes(studentNim);
          nextStatus = !isDone;
          const updatedList = nextStatus
            ? Array.from(new Set([...currentList, studentNim]))
            : currentList.filter((n) => n !== studentNim);
          return {
            ...t,
            completedByNims: updatedList,
            isCompleted: nextStatus
          };
        }
        return t;
      })
    );

    // Firestore sync per-student: adds/removes ONLY this student's NIM from completedByNims
    if (currentClass?.code) {
      await syncToggleTaskForUser(currentClass.code, id, studentNim, nextStatus);
    }
  };

  // Schedule Handlers with real-time Firebase sync
  const handleAddSchedule = async (newSched: Omit<CourseSchedule, 'id'>) => {
    const item: CourseSchedule = {
      ...newSched,
      id: 'mk-' + Date.now(),
    };
    // Optimistic local update
    setSchedules((prev) => [...prev, item]);

    // Firestore sync
    if (currentClass?.code) {
      await syncAddSchedule(currentClass.code, item);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    // Optimistic local update
    setSchedules((prev) => prev.filter((s) => s.id !== id));

    // Firestore sync
    if (currentClass?.code) {
      await syncDeleteSchedule(currentClass.code, id);
    }
  };

  const handleDismissToast = (id: string) => {
    setNotifications((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToastAction = (taskId?: string) => {
    setCurrentPage('dashboard');
    if (taskId) {
      handleDismissToast('toast-' + taskId);
    }
  };

  /**
   * Reset & Clean All Data:
   * Clears localStorage and resets application state to completely clean state
   */
  const handleResetAllData = () => {
    try {
      localStorage.clear();
      localStorage.setItem('siakad_clean_version', SYSTEM_WIPE_VERSION);
    } catch (e) {}
    setIsLoggedIn(false);
    setCurrentClass(null);
    setCurrentUser(initialUser);
    setTasks([]);
    setSchedules([]);
    setNotifications([
      {
        id: 'toast-reset-' + Date.now(),
        title: '🧹 Sistem Berhasil Dibersihkan',
        message: 'Seluruh cache dan data berhasil direset. Aplikasi bersih dan siap digunakan.',
        type: 'success',
        timestamp: Date.now()
      }
    ]);
  };

  // STEP 1: Not Logged In -> Show Login Screen (Differentiating Ketua Kelas & Mahasiswa + NIM input)
  if (!isLoggedIn) {
    return (
      <LoginScreen 
        onLogin={handleLogin} 
        defaultNim={currentUser.nim} 
        onResetData={handleResetAllData}
      />
    );
  }

  // STEP 2: Logged In, but No Class Chosen -> Show Class Gate Screen (Enter Class Code / Create Class)
  if (!currentClass) {
    return (
      <ClassGateScreen
        user={currentUser}
        onClassJoined={handleClassJoined}
        onLogout={handleLogout}
      />
    );
  }

  // STEP 3: Authenticated and Class Joined -> Full Web Portal Experience
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Toast Notification Container */}
      <ToastContainer
        notifications={notifications}
        onDismiss={handleDismissToast}
        onAction={handleToastAction}
      />

      {/* Sidebar Drawer */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={(p) => setCurrentPage(p)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar
          user={currentUser}
          currentClass={currentClass}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onRoleChange={handleRoleChange}
          onLogout={handleLogout}
          onOpenBiodata={() => setCurrentPage('biodata')}
          onSwitchClass={handleSwitchClass}
          onResetData={handleResetAllData}
        />

        {/* Content Body */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-2xl w-full mx-auto">
          {currentPage === 'dashboard' && (
            <DashboardView
              user={currentUser}
              currentClass={currentClass}
              schedules={schedules}
              tasks={tasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onToggleTask={handleToggleTask}
              onAddSchedule={handleAddSchedule}
              onDeleteSchedule={handleDeleteSchedule}
              onOpenBiodata={() => setCurrentPage('biodata')}
              onOpenAnggota={() => setCurrentPage('anggota_kelas')}
            />
          )}

          {currentPage === 'biodata' && (
            <BiodataView
              user={currentUser}
              onBack={() => setCurrentPage('dashboard')}
            />
          )}

          {(currentPage === 'tambah_biodata' || currentPage === 'decision') && (
            <TambahBiodataView
              currentUser={currentUser}
              onBack={() => setCurrentPage('dashboard')}
            />
          )}

          {currentPage === 'anggota_kelas' && currentClass && (
            <AnggotaKelasView
              classInfo={currentClass}
              currentUser={currentUser}
              onBack={() => setCurrentPage('dashboard')}
            />
          )}

          {currentPage !== 'dashboard' && 
           currentPage !== 'biodata' && 
           currentPage !== 'tambah_biodata' && 
           currentPage !== 'decision' && 
           currentPage !== 'anggota_kelas' && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-base font-bold text-gray-800 capitalize">
                Menu {currentPage}
              </h2>
              <p className="text-xs text-gray-500">
                Fitur ini terhubung ke portal akademik SIAKAD Universitas Negeri Gorontalo. Silakan kembali ke menu Dashboard atau Biodata.
              </p>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                Kembali ke Dashboard
              </button>
            </div>
          )}
        </main>

        {/* Web Portal Footer */}
        <footer className="border-t border-gray-200 bg-white py-4 px-6 text-center text-xs text-gray-400">
          <div className="flex items-center justify-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-gray-600">
              Vectoreal Education • Sistem Informasi Akademik
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ⚡ Firebase Live: {currentClass.code}
            </span>
          </div>
          <p className="text-[11px] text-gray-400">
            Universitas Negeri Gorontalo • Terintegrasi PDDikti
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
