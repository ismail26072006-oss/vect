import React, { useState } from 'react';
import { TaskItem, TaskCategory } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  CalendarDays, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { CATEGORY_CONFIG } from './DashboardView';

interface TaskStatsProps {
  tasks: TaskItem[];
  onSelectCategory?: (category: string) => void;
  selectedCategory?: string;
}

export const TaskStats: React.FC<TaskStatsProps> = ({
  tasks,
  onSelectCategory,
  selectedCategory = 'all',
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'mingguan' | 'kategori'>('mingguan');
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.isCompleted).length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const pendingPercentage = total > 0 ? 100 - percentage : 0;

  const categories: TaskCategory[] = ['Study', 'Work', 'Personal', 'Organization'];

  // Days of the week for weekly productivity bar chart
  const weekDays = [
    { key: 'Sen', full: 'Senin', dayIdx: 1 },
    { key: 'Sel', full: 'Selasa', dayIdx: 2 },
    { key: 'Rab', full: 'Rabu', dayIdx: 3 },
    { key: 'Kam', full: 'Kamis', dayIdx: 4 },
    { key: 'Jum', full: 'Jumat', dayIdx: 5 },
    { key: 'Sab', full: 'Sabtu', dayIdx: 6 },
    { key: 'Min', full: 'Minggu', dayIdx: 0 },
  ];

  // Calculate task counts per day of week based on task due date
  const weeklyData = weekDays.map((day) => {
    const dayTasks = tasks.filter((t) => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return !isNaN(d.getTime()) && d.getDay() === day.dayIdx;
    });

    const dayCompleted = dayTasks.filter((t) => t.isCompleted).length;
    const dayPending = dayTasks.length - dayCompleted;
    return {
      ...day,
      total: dayTasks.length,
      completed: dayCompleted,
      pending: dayPending,
    };
  });

  const maxWeeklyTasks = Math.max(1, ...weeklyData.map((d) => d.total));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-xs space-y-4 transition-all">
      {/* 1. Header with Task Stats & Completion Ratio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 shadow-2xs">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <span>Statistik Tugas & Produktivitas</span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {percentage}% Selesai
              </span>
            </h3>
            <p className="text-[11px] text-gray-500">
              {completed} tugas selesai • {pending} tugas belum selesai dari total {total} tugas
            </p>
          </div>
        </div>

        {/* Chart View Toggle: Mingguan vs Kategori */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveChartTab('mingguan')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
              activeChartTab === 'mingguan'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <CalendarDays className="w-3 h-3 text-red-600" />
            <span>Mingguan</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveChartTab('kategori')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
              activeChartTab === 'kategori'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Layers className="w-3 h-3 text-red-600" />
            <span>Kategori</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Split Bar: Selesai vs Belum Selesai */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Selesai: <strong>{completed} ({percentage}%)</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-red-700">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Belum Selesai: <strong>{pending} ({pendingPercentage}%)</strong></span>
          </div>
        </div>

        {/* Dual Stacked Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden flex shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
            title={`Tugas Selesai: ${percentage}%`}
          />
          <div
            className="h-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-700 ease-out"
            style={{ width: `${pendingPercentage}%` }}
            title={`Tugas Belum Selesai: ${pendingPercentage}%`}
          />
        </div>
      </div>

      {/* 3. Simple Bar Chart (Grafik Batang Sederhana) */}
      {activeChartTab === 'mingguan' ? (
        <div className="p-3.5 bg-gray-50/70 border border-gray-100 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5 text-red-600" />
              <span>Grafik Batang Produktivitas Mingguan</span>
            </p>
            <span className="text-[10px] text-gray-400">
              Distribusi tugas per hari
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-3 items-end h-28 pt-4 pb-1 px-1">
            {weeklyData.map((day) => {
              const heightPercent = day.total > 0 ? Math.max(18, Math.round((day.total / maxWeeklyTasks) * 100)) : 10;
              const isHovered = hoveredBar === day.key;
              const completedRatio = day.total > 0 ? (day.completed / day.total) : 0;

              return (
                <div
                  key={day.key}
                  onMouseEnter={() => setHoveredBar(day.key)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="flex flex-col items-center h-full justify-end group cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  <div
                    className={`transition-opacity duration-200 text-[9px] font-bold text-center mb-1 ${
                      isHovered ? 'opacity-100 text-gray-800' : 'opacity-0 text-transparent'
                    }`}
                  >
                    {day.total > 0 ? `${day.completed}/${day.total}` : '0'}
                  </div>

                  {/* Vertical Bar */}
                  <div
                    className="w-full max-w-[28px] rounded-t-lg bg-gray-200 overflow-hidden flex flex-col justify-end transition-all duration-300 group-hover:scale-105 group-hover:shadow-xs"
                    style={{ height: `${heightPercent}%` }}
                  >
                    {day.total > 0 ? (
                      <>
                        {/* Pending portion */}
                        <div
                          className="bg-red-400 w-full transition-all"
                          style={{ height: `${(day.pending / day.total) * 100}%` }}
                          title={`${day.full}: ${day.pending} belum selesai`}
                        />
                        {/* Completed portion */}
                        <div
                          className="bg-emerald-500 w-full transition-all"
                          style={{ height: `${completedRatio * 100}%` }}
                          title={`${day.full}: ${day.completed} selesai`}
                        />
                      </>
                    ) : (
                      <div className="w-full h-1 bg-gray-300 rounded-full" />
                    )}
                  </div>

                  {/* Day Label */}
                  <span
                    className={`text-[10px] mt-1.5 font-bold transition-colors ${
                      isHovered ? 'text-red-600' : 'text-gray-500'
                    }`}
                  >
                    {day.key}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bar Chart Legend */}
          <div className="flex items-center justify-center gap-4 pt-1 text-[10px] font-medium text-gray-500 border-t border-gray-200/50">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              Selesai
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-400" />
              Belum Selesai
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-gray-200" />
              Tidak Ada Tugas
            </span>
          </div>
        </div>
      ) : (
        /* Category-based Bar Chart */
        <div className="p-3.5 bg-gray-50/70 border border-gray-100 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-red-600" />
              <span>Distribusi & Persentase Per Kategori</span>
            </p>
            <span className="text-[10px] text-gray-400">
              Progress per bidang
            </span>
          </div>

          <div className="space-y-2">
            {categories.map((cat) => {
              const cfg = CATEGORY_CONFIG[cat];
              const catTasks = tasks.filter((t) => (t.category || 'Study') === cat);
              const catTotal = catTasks.length;
              const catCompleted = catTasks.filter((t) => t.isCompleted).length;
              const catPct = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-gray-800 flex items-center gap-1">
                      <span>{cfg.icon}</span>
                      <span>{cfg.label}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-gray-600">
                      {catCompleted}/{catTotal} selesai ({catPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${catPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Breakdown: Remaining Tasks Per Category Buttons */}
      <div className="pt-1 border-t border-gray-50">
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Filter Kategori Cepat:</span>
          {onSelectCategory && selectedCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-[10px] text-red-600 hover:underline capitalize font-bold"
            >
              Reset Filter ({selectedCategory})
            </button>
          )}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {categories.map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            const remainingCount = tasks.filter(
              (t) => !t.isCompleted && (t.category || 'Study') === cat
            ).length;
            const totalCount = tasks.filter(
              (t) => (t.category || 'Study') === cat
            ).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                type="button"
                key={cat}
                onClick={() => onSelectCategory && onSelectCategory(isSelected ? 'all' : cat)}
                className={`p-2.5 rounded-xl border text-left transition-all duration-200 group hover:-translate-y-0.5 ${cfg.bg} ${cfg.border} ${
                  isSelected
                    ? 'ring-2 ring-gray-900 shadow-xs'
                    : 'hover:shadow-xs hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base group-hover:scale-110 transition-transform">{cfg.icon}</span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                    remainingCount > 0
                      ? 'bg-red-600 text-white shadow-2xs'
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {remainingCount} tersisa
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className={`text-xs font-bold ${cfg.text}`}>
                    {cfg.label}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    tot: {totalCount}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
