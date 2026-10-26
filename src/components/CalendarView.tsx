import React, { useState } from 'react';
import { CourseSchedule, TaskItem, UserRole } from '../types';
import { 
  Calendar as CalendarIcon, 
  ListFilter, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  Circle, 
  BookOpen,
  CalendarDays,
  LayoutGrid,
  List
} from 'lucide-react';
import { CategoryTag } from './DashboardView';

interface CalendarViewProps {
  schedules: CourseSchedule[];
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  userRole?: UserRole;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  schedules,
  tasks,
  onToggleTask,
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Month navigation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const setToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(now.toISOString().split('T')[0]);
  };

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
  const adjustedFirstDay = (firstDayIndex + 6) % 7; // 0 = Mon
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Day of week name mapping for a date
  const getDayNameFromDate = (d: Date): string => {
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return dayNames[d.getDay()];
  };

  // Get schedules for a specific day of week
  const getSchedulesForDayName = (dayName: string) => {
    return schedules.filter((s) => s.dayOfWeek.toLowerCase() === dayName.toLowerCase());
  };

  // Get tasks for a specific date YYYY-MM-DD
  const getTasksForDate = (dateStr: string) => {
    return tasks.filter((t) => t.dueDate === dateStr);
  };

  // Detail for currently selected date
  const selectedDateObj = selectedDateStr ? new Date(selectedDateStr) : null;
  const selectedDayName = selectedDateObj ? getDayNameFromDate(selectedDateObj) : '';
  const selectedDaySchedules = selectedDayName ? getSchedulesForDayName(selectedDayName) : [];
  const selectedDayTasks = selectedDateStr ? getTasksForDate(selectedDateStr) : [];

  // Grouped task list sorted chronologically
  const sortedTasks = [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div className="space-y-4">
      {/* Top Header Card: View Switcher & Month Navigation */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-red-600" />
              <span>Kalender Akademik & Jadwal Kuliah</span>
            </h2>
            <p className="text-xs text-gray-500">
              Integrasi jadwal perkuliahan mingguan dan tenggat waktu tugas
            </p>
          </div>

          {/* Switcher: Month View vs Task List View */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'month'
                  ? 'bg-white text-gray-900 font-bold shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tampilan Bulan</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 font-bold shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Daftar Tugas</span>
            </button>
          </div>
        </div>

        {/* 1. MONTH VIEW */}
        {viewMode === 'month' && (
          <div className="pt-3 space-y-4">
            {/* Month navigation bar */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                {monthNames[month]} {year}
              </h3>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
                  title="Bulan Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={setToday}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700"
                >
                  Hari Ini
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
                  title="Bulan Berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday columns */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-gray-500">
              <span className="py-1">Sen</span>
              <span className="py-1">Sel</span>
              <span className="py-1">Rab</span>
              <span className="py-1">Kam</span>
              <span className="py-1">Jum</span>
              <span className="py-1">Sab</span>
              <span className="py-1 text-red-500">Min</span>
            </div>

            {/* Month Day Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-20 sm:h-24 bg-gray-50/40 rounded-xl" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const cellDate = new Date(year, month, dayNum);
                const dayName = getDayNameFromDate(cellDate);
                const daySchedules = getSchedulesForDayName(dayName);
                const dayTasks = getTasksForDate(dateStr);

                const isSelected = selectedDateStr === dateStr;
                const todayStr = new Date().toISOString().split('T')[0];
                const isToday = dateStr === todayStr;
                const hasEvents = daySchedules.length > 0 || dayTasks.length > 0;

                return (
                  <div
                    key={`day-${dayNum}`}
                    onClick={() => setSelectedDateStr(dateStr)}
                    className={`h-20 sm:h-24 p-1.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-red-600 ring-2 ring-red-500/20 bg-red-50/40 shadow-xs'
                        : isToday
                        ? 'border-red-300 bg-red-50/20'
                        : hasEvents
                        ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/70'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${
                        isToday 
                          ? 'w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]' 
                          : isSelected
                          ? 'text-red-700 font-black'
                          : 'text-gray-800'
                      }`}>
                        {dayNum}
                      </span>

                      {/* Total count indicator */}
                      {dayTasks.length > 0 && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-red-600 text-white leading-tight">
                          {dayTasks.length} T
                        </span>
                      )}
                    </div>

                    {/* Chips for Course Schedules & Tasks */}
                    <div className="space-y-0.5 overflow-hidden">
                      {/* Course schedules preview badge */}
                      {daySchedules.length > 0 && (
                        <div className="text-[9px] font-medium truncate px-1 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-0.5">
                          <span>📚</span>
                          <span className="truncate">{daySchedules[0].courseName}</span>
                        </div>
                      )}

                      {/* Tasks preview badge */}
                      {dayTasks.slice(0, 1).map((t) => (
                        <div
                          key={t.id}
                          className={`text-[9px] font-medium truncate px-1 py-0.2 rounded border ${
                            t.isCompleted
                              ? 'bg-gray-100 text-gray-500 line-through border-gray-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          <span>{t.title}</span>
                        </div>
                      ))}

                      {dayTasks.length > 1 && (
                        <p className="text-[8px] text-gray-400 font-medium pl-0.5">
                          +{dayTasks.length - 1} tugas lagi
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend info */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Jadwal Perkuliahan Rutin</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                <span>Tenggat Pengumpulan Tugas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-100 border border-red-400" />
                <span>Hari Ini</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. TASK LIST / AGENDA VIEW */}
        {viewMode === 'list' && (
          <div className="pt-3 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">
                Agenda Tugas & Jadwal Terdekat
              </h3>
              <span className="text-xs text-gray-500">
                Total {sortedTasks.length} tugas terdaftar
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {sortedTasks.length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center">
                  Belum ada tugas yang dijadwalkan.
                </p>
              ) : (
                sortedTasks.map((t) => (
                  <div
                    key={t.id}
                    className={`py-3 flex items-start gap-3 transition-colors ${
                      t.isCompleted ? 'opacity-65' : ''
                    }`}
                  >
                    <button
                      onClick={() => onToggleTask(t.id)}
                      className="mt-1 text-gray-400 hover:text-green-600 transition-transform active:scale-90"
                      title={t.isCompleted ? 'Tandai belum selesai' : 'Tandai selesai'}
                    >
                      {t.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className={`text-xs sm:text-sm font-bold ${
                          t.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'
                        }`}>
                          {t.title}
                        </h4>
                        <CategoryTag category={t.category || 'Study'} />
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
                        <p className="text-xs text-gray-600">{t.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="font-semibold text-red-600">{t.courseName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium">
                          <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                          {t.dueDate} ({t.dueTime})
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Day Details (Below the Calendar in Month view) */}
      {viewMode === 'month' && selectedDateStr && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Agenda: {selectedDayName}, {selectedDateStr}
                </h3>
                <p className="text-[11px] text-gray-500">
                  {selectedDaySchedules.length} mata kuliah • {selectedDayTasks.length} tugas
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedDateStr(null)}
              className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-md hover:bg-gray-100"
            >
              Tutup
            </button>
          </div>

          {/* 1. Jadwal Kuliah Rutin on this day */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Jadwal Perkuliahan ({selectedDayName})</span>
            </h4>
            {selectedDaySchedules.length === 0 ? (
              <p className="text-xs text-gray-400 py-2 italic">
                Tidak ada jadwal perkuliahan rutin pada hari {selectedDayName}.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedDaySchedules.map((s) => (
                  <div key={s.id} className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-bold text-blue-950">{s.courseName}</h5>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-200 text-blue-800">
                        {s.sks} SKS
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-blue-800">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-600" />
                        {s.startTime} - {s.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        {s.room}
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-900 font-medium flex items-center gap-1">
                      <User className="w-3 h-3 text-blue-600" />
                      {s.lecturer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Tasks Due on this date */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-red-600" />
              <span>Tenggat Tugas ({selectedDateStr})</span>
            </h4>
            {selectedDayTasks.length === 0 ? (
              <p className="text-xs text-gray-400 py-2 italic">
                Tidak ada tenggat tugas pada tanggal ini.
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {selectedDayTasks.map((t) => (
                  <div key={t.id} className="py-2.5 flex items-start gap-3">
                    <button
                      onClick={() => onToggleTask(t.id)}
                      className="mt-0.5 text-gray-400 hover:text-green-600 transition-transform active:scale-90"
                    >
                      {t.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className={`text-xs font-bold ${
                          t.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'
                        }`}>
                          {t.title}
                        </h5>
                        <CategoryTag category={t.category || 'Study'} />
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          t.priority === 'HIGH' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {t.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {t.courseName} • Pukul {t.dueTime}
                      </p>
                      {t.description && (
                        <p className="text-xs text-gray-600 mt-1">{t.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
