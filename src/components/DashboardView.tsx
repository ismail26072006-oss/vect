import React, { useState } from 'react';
import { 
  UserProfile, 
  CourseSchedule, 
  TaskItem, 
  DashboardTab, 
  TaskPriority,
  TaskCategory,
  UserRole,
  ClassInfo
} from '../types';
import { 
  GraduationCap, 
  CreditCard, 
  BookOpen, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Broadcast,
  Share2,
  Check,
  Tag,
  Users,
  School,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  X
} from 'lucide-react';
import { TaskStats } from './TaskStats';
import { CalendarView } from './CalendarView';

export const CATEGORY_CONFIG: Record<TaskCategory, { label: string; bg: string; text: string; border: string; icon: string }> = {
  Study: {
    label: 'Study',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: '📚'
  },
  Work: {
    label: 'Work',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: '💼'
  },
  Personal: {
    label: 'Personal',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: '👤'
  },
  Organization: {
    label: 'Organization',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: '🏛️'
  }
};

export const CategoryTag: React.FC<{ category?: TaskCategory | string; size?: 'sm' | 'xs' }> = ({ category, size = 'xs' }) => {
  if (!category) return null;
  const config = CATEGORY_CONFIG[category as TaskCategory] || {
    label: category,
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: '🏷️'
  };

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-md border ${config.bg} ${config.text} ${config.border} ${
      size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-[10px] px-1.5 py-0.5'
    }`}>
      <span className="text-[11px] leading-none">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};

interface DashboardViewProps {
  user: UserProfile;
  currentClass?: ClassInfo | null;
  schedules: CourseSchedule[];
  tasks: TaskItem[];
  onAddTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  onAddSchedule: (schedule: Omit<CourseSchedule, 'id'>) => void;
  onDeleteSchedule: (id: string) => void;
  onOpenBiodata: () => void;
  onOpenAnggota?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  currentClass,
  schedules,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTask,
  onAddSchedule,
  onDeleteSchedule,
  onOpenBiodata,
  onOpenAnggota,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('semua');
  const [selectedDay, setSelectedDay] = useState<string>('Senin');

  // Task Filter states
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed' | 'class'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [taskSearch, setTaskSearch] = useState('');

  // Calendar states
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedCalendarDayStr, setSelectedCalendarDayStr] = useState<string | null>(null);

  // Dialog states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Form states for Task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskCourse, setTaskCourse] = useState('');
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('Study');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskDueTime, setTaskDueTime] = useState('23:59');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('MEDIUM');
  const [taskIsClass, setTaskIsClass] = useState(true);

  // Animation feedback state for completed toggle
  const [justToggledId, setJustToggledId] = useState<string | null>(null);

  const handleAnimatedToggle = (id: string) => {
    setJustToggledId(id);
    onToggleTask(id);
    setTimeout(() => {
      setJustToggledId((prev) => (prev === id ? null : prev));
    }, 600);
  };

  // Form states for Schedule
  const [schedCourseName, setSchedCourseName] = useState('');
  const [schedCourseCode, setSchedCourseCode] = useState('');
  const [schedDay, setSchedDay] = useState('Senin');
  const [schedStart, setSchedStart] = useState('08:00');
  const [schedEnd, setSchedEnd] = useState('10:30');
  const [schedRoom, setSchedRoom] = useState('Ruang Teori 1');
  const [schedLecturer, setSchedLecturer] = useState('');
  const [schedSks, setSchedSks] = useState(3);

  const daysShort = [
    { key: 'Senin', label: 'Sen' },
    { key: 'Selasa', label: 'Sel' },
    { key: 'Rabu', label: 'Rab' },
    { key: 'Kamis', label: 'Kam' },
    { key: 'Jumat', label: 'Jum' },
    { key: 'Sabtu', label: 'Sab' },
  ];

  // Open Task modal for creation
  const handleOpenCreateTask = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskDescription('');
    setTaskCourse(schedules[0]?.courseName || 'Mata Kuliah Umum');
    setTaskCategory('Study');
    setTaskDueDate(new Date().toISOString().split('T')[0]);
    setTaskDueTime('23:59');
    setTaskPriority('MEDIUM');
    setTaskIsClass(user.role === 'KETUA_KELAS');
    setShowTaskModal(true);
  };

  // Open Task modal for editing
  const handleOpenEditTask = (task: TaskItem) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskCourse(task.courseName);
    setTaskCategory(task.category || 'Study');
    setTaskDueDate(task.dueDate);
    setTaskDueTime(task.dueTime);
    setTaskPriority(task.priority);
    setTaskIsClass(task.isClassTask);
    setShowTaskModal(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (editingTask) {
      onEditTask({
        ...editingTask,
        title: taskTitle,
        description: taskDescription,
        courseName: taskCourse,
        category: taskCategory,
        dueDate: taskDueDate,
        dueTime: taskDueTime,
        priority: taskPriority,
        isClassTask: taskIsClass,
      });
    } else {
      onAddTask({
        title: taskTitle,
        description: taskDescription,
        courseName: taskCourse,
        category: taskCategory,
        dueDate: taskDueDate,
        dueTime: taskDueTime,
        priority: taskPriority,
        isCompleted: false,
        isClassTask: taskIsClass,
      });
    }
    setShowTaskModal(false);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedCourseName.trim()) return;

    onAddSchedule({
      courseName: schedCourseName,
      courseCode: schedCourseCode || 'MK' + Math.floor(100 + Math.random() * 900),
      dayOfWeek: schedDay,
      startTime: schedStart,
      endTime: schedEnd,
      room: schedRoom,
      lecturer: schedLecturer || 'Dosen Pengampu',
      sks: Number(schedSks) || 3,
    });
    setShowScheduleModal(false);
    setSchedCourseName('');
    setSchedCourseCode('');
    setSchedLecturer('');
  };

  // Filtered tasks
  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'pending' && t.isCompleted) return false;
    if (taskFilter === 'completed' && !t.isCompleted) return false;
    if (taskFilter === 'class' && !t.isClassTask) return false;
    if (selectedCategory !== 'all' && (t.category || 'Study') !== selectedCategory) return false;
    if (taskSearch.trim()) {
      const q = taskSearch.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.courseName.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        t.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calendar calculations
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
  // shift so Mon is 0: (day + 6) % 7
  const adjustedFirstDay = (firstDayIndex + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCalendarDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCalendarDate(new Date(year, month + 1, 1));
  };

  // Tasks for a given day in format YYYY-MM-DD
  const getTasksForDate = (dateStr: string) => {
    return tasks.filter((t) => t.dueDate === dateStr);
  };

  const tasksOnSelectedCalendarDay = selectedCalendarDayStr
    ? getTasksForDate(selectedCalendarDayStr)
    : [];

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-12">
      {/* 1. Red Header Container (Dashboard) */}
      <div className="bg-[#D32F2F] text-white rounded-2xl shadow-sm p-4">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xl select-none">
              Σ
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Vectoreal Education</h1>
              <p className="text-xs text-white/90 font-medium">
                Manajemen Tugas & Jadwal Perkuliahan
              </p>
            </div>
          </div>

          {onOpenAnggota && (
            <button
              onClick={onOpenAnggota}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-all shadow-2xs backdrop-blur-md shrink-0"
              title="Lihat daftar mahasiswa yang sudah bergabung ke kelas ini"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Anggota Kelas</span>
            </button>
          )}
        </div>

        {/* 4 Tabs: Semua, Jadwal MK, Tugas, Kalender (All in 1 row without sliding) */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-black/25 rounded-xl text-xs font-semibold">
          {[
            { id: 'semua' as DashboardTab, label: 'Semua' },
            { id: 'jadwal' as DashboardTab, label: 'Jadwal' },
            { id: 'tugas' as DashboardTab, label: 'Tugas' },
            { id: 'kalender' as DashboardTab, label: 'Kalender' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 text-center rounded-lg transition-all truncate text-xs ${
                  isActive
                    ? 'bg-white text-gray-900 font-bold shadow-xs'
                    : 'text-white hover:bg-white/10 font-medium'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TaskStats Component: Percentage of completed tasks & remaining count per category */}
      <TaskStats
        tasks={tasks}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (activeTab === 'semua') {
            setActiveTab('tugas');
          }
        }}
      />

      {/* Real-time Task Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={taskSearch}
            onChange={(e) => setTaskSearch(e.target.value)}
            placeholder="Cari tugas berdasarkan judul atau deskripsi..."
            className="w-full pl-9 pr-9 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all bg-gray-50/60 hover:bg-white text-gray-900 placeholder:text-gray-400"
          />
          {taskSearch && (
            <button
              onClick={() => setTaskSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {taskSearch.trim() && (
          <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2 px-1">
            <span>
              Menemukan <strong>{filteredTasks.length}</strong> dari {tasks.length} tugas
            </span>
            <button
              onClick={() => setTaskSearch('')}
              className="text-red-600 font-semibold hover:underline"
            >
              Hapus Filter
            </button>
          </div>
        )}
      </div>

      {/* 2. TAB CONTENT */}
      {/* 2.1 TAB SEMUA */}
      {activeTab === 'semua' && (
        <div className="space-y-4">
          {/* CARD-BASED GRID SYSTEM FOR SUMMARY WIDGETS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* WIDGET 1: Active Class Info Card */}
            <div 
              onClick={onOpenAnggota}
              className="group relative overflow-hidden bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 hover:border-red-300 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
                    <School className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Firebase Live
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Ruang Kelas Aktif
                    </span>
                    {currentClass?.nimRestriction?.enabled && (
                      <span className="text-[9px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-1 rounded">
                        🔒 Filter NIM
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-extrabold text-gray-900 group-hover:text-red-700 transition-colors truncate mt-0.5">
                    {currentClass?.name || 'Pendidikan Teknologi Informasi'}
                  </h3>
                  <p className="text-xs font-mono font-bold text-red-600 mt-0.5">
                    Kode: {currentClass?.code || 'PTI-2024A'}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">
                    Ketua: {currentClass?.creatorName || user.name}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs text-red-600 font-bold">
                <span className="text-[11px] flex items-center gap-1 text-gray-600 group-hover:text-red-600 transition-colors">
                  <Users className="w-3.5 h-3.5" />
                  <span>Lihat Anggota Kelas</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* WIDGET 2: Productivity Stats Card */}
            <div 
              onClick={() => setActiveTab('tugas')}
              className="group relative overflow-hidden bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {tasks.length > 0 ? Math.round((tasks.filter(t => t.isCompleted).length / tasks.length) * 100) : 0}% Selesai
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Ringkasan Tugas
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black text-gray-900">
                      {tasks.filter(t => !t.isCompleted).length}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      belum selesai ({tasks.filter(t => t.isCompleted).length} selesai)
                    </span>
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden flex">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${tasks.length > 0 ? (tasks.filter(t => t.isCompleted).length / tasks.length) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs text-emerald-700 font-bold">
                <span className="text-[11px] text-gray-600 group-hover:text-emerald-700 transition-colors flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{schedules.length} Jadwal Kuliah Terdaftar</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* WIDGET 3: Upcoming Tasks Summary Widget */}
            <div 
              onClick={() => setActiveTab('tugas')}
              className="group relative overflow-hidden bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 hover:border-amber-300 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    Tenggat Terdekat
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Tugas Prioritas Utama
                  </span>
                  {tasks.filter(t => !t.isCompleted).length > 0 ? (
                    (() => {
                      const nearestTask = tasks.filter(t => !t.isCompleted)[0];
                      return (
                        <div className="mt-1">
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate group-hover:text-amber-700 transition-colors">
                            {nearestTask.title}
                          </h4>
                          <p className="text-[11px] text-gray-500 truncate mt-0.5">
                            {nearestTask.courseName} • {nearestTask.dueDate} ({nearestTask.dueTime})
                          </p>
                        </div>
                      );
                    })()
                  ) : (
                    <p className="text-xs text-gray-400 font-medium mt-1">
                      Semua tugas telah diselesaikan!
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs text-amber-700 font-bold">
                <span className="text-[11px] text-gray-600 group-hover:text-amber-700 transition-colors flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span>Buka Semua Tugas</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Quick Schedule & Tasks Section */}
          <div className="space-y-4">
            {/* Quick Jadwal Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-600" />
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Jadwal Kuliah Terdekat
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('jadwal')}
                  className="text-xs sm:text-sm text-red-600 font-semibold hover:underline"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {schedules.slice(0, 3).map((s) => (
                  <div key={s.id} className="py-3 first:pt-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 leading-snug">{s.courseName}</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                          <span>{s.dayOfWeek}, {s.startTime} - {s.endTime}</span>
                          <span>•</span>
                          <span>{s.room}</span>
                        </p>
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-700 whitespace-nowrap">
                        {s.sks} SKS
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Deadlines Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-red-600" />
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Tenggat Tugas Mendatang
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('tugas')}
                  className="text-xs sm:text-sm text-red-600 font-semibold hover:underline"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {tasks
                  .filter((t) => !t.isCompleted)
                  .filter((t) => {
                    if (!taskSearch.trim()) return true;
                    const q = taskSearch.toLowerCase();
                    return (
                      t.title.toLowerCase().includes(q) ||
                      t.description.toLowerCase().includes(q) ||
                      t.courseName.toLowerCase().includes(q)
                    );
                  })
                  .slice(0, 5)
                  .map((t) => (
                    <div
                      key={t.id}
                      className={`py-3 first:pt-3 flex items-start gap-3 transition-all duration-300 ${
                        justToggledId === t.id
                          ? t.isCompleted
                            ? 'animate-complete-glow'
                            : 'scale-95'
                          : ''
                      }`}
                    >
                      <button
                        onClick={() => handleAnimatedToggle(t.id)}
                        className="mt-0.5 text-gray-400 hover:text-green-600 transition-transform active:scale-90 focus:outline-none shrink-0"
                        title={t.isCompleted ? 'Tandai belum selesai' : 'Tandai selesai'}
                      >
                        {t.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 animate-check-pop" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`text-sm font-bold leading-snug truncate transition-all duration-300 ${
                            t.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'
                          }`}>
                            {t.title}
                          </h4>
                          <CategoryTag category={t.category || 'Study'} />
                          {user.role === 'KETUA_KELAS' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-0.5">
                              <Users className="w-2.5 h-2.5 text-indigo-600" />
                              <span>{t.completedByNims?.length || 0} Selesai</span>
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs mt-1">
                          <span className="text-red-600 font-medium">{t.courseName}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">{t.dueDate} ({t.dueTime})</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                        t.priority === 'HIGH' 
                          ? 'bg-red-50 text-red-600 border border-red-200' 
                          : t.priority === 'MEDIUM'
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-green-50 text-green-600 border border-green-200'
                      }`}>
                        {t.priority}
                      </span>
                    </div>
                  ))}
                {tasks.filter(t => !t.isCompleted).length === 0 && (
                  <p className="text-xs text-gray-400 py-4 text-center">
                    Tidak ada tugas yang tertunda.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2.2 TAB JADWAL MK */}
      {activeTab === 'jadwal' && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">Jadwal Perkuliahan</h2>
              <p className="text-xs text-gray-500">
                Daftar mata kuliah aktif semester berjalan
              </p>
            </div>

            {/* Ketua Kelas Button to Add Schedule */}
            {user.role === 'KETUA_KELAS' && (
              <button
                onClick={() => setShowScheduleModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Jadwal</span>
              </button>
            )}
          </div>

          {/* Day selection buttons (Sen, Sel, Rab, Kam, Jum, Sab) */}
          <div className="grid grid-cols-6 gap-1.5 p-1 bg-gray-100 rounded-lg">
            {daysShort.map((d) => {
              const isSelected = selectedDay === d.key;
              return (
                <button
                  key={d.key}
                  onClick={() => setSelectedDay(d.key)}
                  className={`py-2 text-center text-xs font-bold rounded-md transition-all ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>

          {/* List of courses for selected day */}
          <div className="space-y-3">
            {schedules.filter((s) => s.dayOfWeek === selectedDay).length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-500">
                  Tidak ada jadwal kuliah di hari {selectedDay}
                </p>
                {user.role === 'KETUA_KELAS' && (
                  <button
                    onClick={() => {
                      setSchedDay(selectedDay);
                      setShowScheduleModal(true);
                    }}
                    className="mt-2 text-xs text-red-600 font-bold hover:underline"
                  >
                    + Tambah mata kuliah untuk hari ini
                  </button>
                )}
              </div>
            ) : (
              schedules
                .filter((s) => s.dayOfWeek === selectedDay)
                .map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-xs transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
                          {s.courseCode}
                        </span>
                        <span className="text-xs font-bold text-gray-900">{s.courseName}</span>
                      </div>
                      <p className="text-xs text-gray-600 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>{s.lecturer}</span>
                      </p>
                      <div className="flex items-center gap-4 text-[11px] text-gray-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {s.startTime} - {s.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {s.room}
                        </span>
                        <span className="font-semibold text-gray-700">
                          {s.sks} SKS
                        </span>
                      </div>
                    </div>

                    {user.role === 'KETUA_KELAS' && (
                      <button
                        onClick={() => onDeleteSchedule(s.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors self-end sm:self-auto"
                        title="Hapus Jadwal (Khusus Ketua Kelas)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* 2.3 TAB TUGAS */}
      {activeTab === 'tugas' && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">Daftar Tugas & Deadline</h2>
              <p className="text-xs text-gray-500">
                Kelola tugas kuliah, praktikum, dan proyek kelompok
              </p>
            </div>

            {/* Ketua Kelas Button to Add Task */}
            {user.role === 'KETUA_KELAS' ? (
              <button
                onClick={handleOpenCreateTask}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Buat Tugas Kelas</span>
              </button>
            ) : (
              <div className="text-[11px] text-gray-400 italic">
                *Hanya Ketua Kelas yang dapat menyiarkan tugas baru ke kelas.
              </div>
            )}
          </div>

          {/* Filter Bar & Search */}
          <div className="space-y-2.5 pt-1">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-medium">
                {[
                  { key: 'all', label: 'Semua Status' },
                  { key: 'pending', label: 'Belum Selesai' },
                  { key: 'completed', label: 'Selesai' },
                  { key: 'class', label: 'Tugas Kelas' },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setTaskFilter(f.key as any)}
                    className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                      taskFilter === f.key
                        ? 'bg-red-600 text-white font-bold'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                  placeholder="Cari tugas..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Category Filter Pills (Colored Tag Filter) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
                <Tag className="w-3 h-3 text-gray-400" />
                Kategori:
              </span>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gray-800 text-white shadow-2xs font-bold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Semua Kategori
              </button>
              {(['Study', 'Work', 'Personal', 'Organization'] as TaskCategory[]).map((cat) => {
                const cfg = CATEGORY_CONFIG[cat];
                const isSel = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-all border ${
                      isSel
                        ? `${cfg.bg} ${cfg.text} ${cfg.border} ring-2 ring-gray-800 font-bold shadow-2xs`
                        : `${cfg.bg} ${cfg.text} ${cfg.border} opacity-75 hover:opacity-100`
                    }`}
                  >
                    <span>{cfg.icon}</span>
                    <span>{cfg.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Task list cards */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <CheckCircle2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-500">
                  Tidak ada tugas yang sesuai filter.
                </p>
              </div>
            ) : (
              filteredTasks.map((t) => (
                <div
                  key={t.id}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    t.isCompleted
                      ? 'bg-gray-50/70 border-gray-200 opacity-75'
                      : 'bg-white border-gray-200 hover:border-red-300 hover:shadow-xs hover:-translate-y-0.5'
                  } ${
                    justToggledId === t.id
                      ? t.isCompleted
                        ? 'animate-complete-glow'
                        : 'scale-98'
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleAnimatedToggle(t.id)}
                      className="mt-1 text-gray-400 hover:text-green-600 transition-transform active:scale-90"
                      title={t.isCompleted ? 'Tandai belum selesai' : 'Tandai selesai'}
                    >
                      {t.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 animate-check-pop" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className={`text-xs font-bold transition-all duration-300 ${t.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {t.title}
                        </h4>
                        <CategoryTag category={t.category || 'Study'} />
                        {t.isClassTask && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                            <span>📢 Tugas Kelas</span>
                          </span>
                        )}
                        {user.role === 'KETUA_KELAS' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1" title={`${t.completedByNims?.length || 0} mahasiswa telah menyelesaikan tugas ini`}>
                            <Users className="w-3 h-3 text-indigo-600" />
                            <span>{t.completedByNims?.length || 0} Mahasiswa Selesai</span>
                          </span>
                        )}
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          t.priority === 'HIGH'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : t.priority === 'MEDIUM'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                          {t.priority}
                        </span>
                      </div>

                      {t.description && (
                        <p className="text-xs text-gray-600 pt-0.5">{t.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 pt-1">
                        <span className="font-semibold text-red-600">{t.courseName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                          Batas: {t.dueDate} ({t.dueTime})
                        </span>
                      </div>
                    </div>

                    {user.role === 'KETUA_KELAS' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditTask(t)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100"
                          title="Edit Tugas"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTask(t.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                          title="Hapus Tugas"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2.4 TAB KALENDER: Month View and Task List View with schedules and tasks */}
      {activeTab === 'kalender' && (
        <CalendarView
          schedules={schedules}
          tasks={tasks}
          onToggleTask={handleAnimatedToggle}
          userRole={user.role}
        />
      )}

      {/* 3. MODAL: Buat / Edit Tugas (Khusus Ketua Kelas atau Tugas Baru) */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-md w-full p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              {editingTask ? 'Edit Tugas Perkuliahan' : 'Buat Tugas Baru'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {user.role === 'KETUA_KELAS' ? 'Tugas dapat disiarkan langsung ke seluruh kelas' : 'Tugas catatan pribadi'}
            </p>

            <form onSubmit={handleSaveTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Judul Tugas</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Contoh: Laporan Praktikum Modul 3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Mata Kuliah</label>
                <select
                  value={taskCourse}
                  onChange={(e) => setTaskCourse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  {schedules.map((s) => (
                    <option key={s.id} value={s.courseName}>{s.courseName}</option>
                  ))}
                  <option value="Tugas Umum / Lainnya">Tugas Umum / Lainnya</option>
                </select>
              </div>

              {/* Category Tag Selection */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  <span>Kategori Tugas</span>
                  <span className="text-[10px] text-gray-400 font-normal">Pilih tag warna</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Study', 'Work', 'Personal', 'Organization'] as TaskCategory[]).map((cat) => {
                    const cfg = CATEGORY_CONFIG[cat];
                    const isSelected = taskCategory === cat;
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setTaskCategory(cat)}
                        className={`py-2 px-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? `${cfg.bg} ${cfg.text} ${cfg.border} ring-2 ring-red-500 font-bold shadow-xs`
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-sm">{cfg.icon}</span>
                        <span>{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tanggal Deadline</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Jam Deadline</label>
                  <input
                    type="time"
                    value={taskDueTime}
                    onChange={(e) => setTaskDueTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Prioritas</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['LOW', 'MEDIUM', 'HIGH'] as TaskPriority[]).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setTaskPriority(p)}
                      className={`py-1.5 rounded-lg border text-center font-bold ${
                        taskPriority === p
                          ? 'border-red-600 bg-red-50 text-red-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p === 'HIGH' ? 'Tinggi' : p === 'MEDIUM' ? 'Sedang' : 'Rendah'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Deskripsi / Petunjuk Pengerjaan</label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Keterangan format PDF, link pengumpulan, dsb."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              {user.role === 'KETUA_KELAS' && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="classTaskBroadcast"
                    checked={taskIsClass}
                    onChange={(e) => setTaskIsClass(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <label htmlFor="classTaskBroadcast" className="text-[11px] text-blue-900 font-medium cursor-pointer">
                    Siarkan sebagai <strong>Tugas Resmi Kelas</strong> (Dilihat oleh seluruh mahasiswa)
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Simpan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL: Tambah Jadwal MK (Khusus Ketua Kelas) */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-md w-full p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Tambah Jadwal Perkuliahan</h3>
            <p className="text-xs text-gray-500 mb-4">
              Khusus Ketua Kelas: Menetapkan jadwal kuliah semester untuk kelas PTI
            </p>

            <form onSubmit={handleSaveSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nama Mata Kuliah</label>
                <input
                  type="text"
                  value={schedCourseName}
                  onChange={(e) => setSchedCourseName(e.target.value)}
                  placeholder="Contoh: Pemrograman Web Lanjut"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Kode MK</label>
                  <input
                    type="text"
                    value={schedCourseCode}
                    onChange={(e) => setSchedCourseCode(e.target.value)}
                    placeholder="Contoh: PTI310"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">SKS</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={schedSks}
                    onChange={(e) => setSchedSks(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Hari</label>
                  <select
                    value={schedDay}
                    onChange={(e) => setSchedDay(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Jam Mulai</label>
                  <input
                    type="time"
                    value={schedStart}
                    onChange={(e) => setSchedStart(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Jam Selesai</label>
                  <input
                    type="time"
                    value={schedEnd}
                    onChange={(e) => setSchedEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Ruangan / Lab</label>
                  <input
                    type="text"
                    value={schedRoom}
                    onChange={(e) => setSchedRoom(e.target.value)}
                    placeholder="Contoh: Lab Komputer 2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Dosen Pengampu</label>
                  <input
                    type="text"
                    value={schedLecturer}
                    onChange={(e) => setSchedLecturer(e.target.value)}
                    placeholder="Nama dosen & gelar"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
