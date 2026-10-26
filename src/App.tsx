import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, CourseSchedule, TaskItem, NavPage } from './types';
import { initialUser, initialSchedules, initialTasks } from './data/initialData';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { BiodataView } from './components/BiodataView';

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('siakad_logged_in') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('siakad_user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [schedules, setSchedules] = useState<CourseSchedule[]>(() => {
    const saved = localStorage.getItem('siakad_schedules');
    return saved ? JSON.parse(saved) : initialSchedules;
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('siakad_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('siakad_logged_in', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('siakad_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('siakad_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('siakad_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleLogin = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role: newRole }));
  };

  const handleAddTask = (newTask: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const item: TaskItem = {
      ...newTask,
      id: 'task-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [item, ...prev]);
  };

  const handleEditTask = (updatedTask: TaskItem) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const handleAddSchedule = (newSched: Omit<CourseSchedule, 'id'>) => {
    const item: CourseSchedule = {
      ...newSched,
      id: 'mk-' + Date.now(),
    };
    setSchedules((prev) => [...prev, item]);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Sidebar Drawer */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={(p) => setCurrentPage(p)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar
          user={currentUser}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onRoleChange={handleRoleChange}
          onLogout={handleLogout}
          onOpenBiodata={() => setCurrentPage('biodata')}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentPage === 'dashboard' && (
            <DashboardView
              user={currentUser}
              schedules={schedules}
              tasks={tasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onToggleTask={handleToggleTask}
              onAddSchedule={handleAddSchedule}
              onDeleteSchedule={handleDeleteSchedule}
              onOpenBiodata={() => setCurrentPage('biodata')}
            />
          )}

          {currentPage === 'biodata' && (
            <BiodataView
              user={currentUser}
              onBack={() => setCurrentPage('dashboard')}
            />
          )}

          {currentPage !== 'dashboard' && currentPage !== 'biodata' && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-base font-bold text-gray-800 capitalize">
                Menu {currentPage}
              </h2>
              <p className="text-xs text-gray-500">
                Fitur ini terhubung ke portal akademik SIAKAD Universitas Negeri Gorontalo. Silakan kembali ke menu Dashboard atau Biodata.
              </p>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Kembali ke Dashboard
              </button>
            </div>
          )}
        </main>

        {/* Web Portal Footer */}
        <footer className="border-t border-gray-200 bg-white py-4 px-6 text-center text-xs text-gray-400">
          <p className="font-semibold text-gray-600">
            Vectoreal Education • Sistem Informasi Akademik
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Universitas Negeri Gorontalo • Terintegrasi PDDikti
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
