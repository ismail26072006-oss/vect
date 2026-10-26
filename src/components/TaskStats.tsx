import React from 'react';
import { TaskItem, TaskCategory } from '../types';
import { CheckCircle2, ListTodo, TrendingUp } from 'lucide-react';
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
  const total = tasks.length;
  const completed = tasks.filter((t) => t.isCompleted).length;
  const remaining = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const categories: TaskCategory[] = ['Study', 'Work', 'Personal', 'Organization'];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Header Row with Completion Percentage */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900">
              Progres Penyelesaian Tugas
            </h3>
            <p className="text-[11px] text-gray-500">
              {completed} dari {total} tugas selesai • {remaining} tersisa
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {percentage}%
            </span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            percentage === 100 
              ? 'bg-green-100 text-green-700' 
              : percentage > 0 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {percentage === 100 ? 'Tuntas' : percentage > 0 ? 'Sedang Berjalan' : 'Belum Ada'}
          </span>
        </div>
      </div>

      {/* Progress Bar with smooth animation */}
      <div className="space-y-1.5">
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              percentage === 100
                ? 'bg-green-500'
                : percentage >= 50
                ? 'bg-blue-600'
                : 'bg-red-600'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Breakdown: Remaining Tasks Per Category */}
      <div className="pt-1 border-t border-gray-50">
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Tugas Tersisa Per Kategori:</span>
          {onSelectCategory && selectedCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-[10px] text-red-600 hover:underline capitalize"
            >
              Reset Filter
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
                className={`p-2.5 rounded-xl border text-left transition-all ${cfg.bg} ${cfg.border} ${
                  isSelected
                    ? 'ring-2 ring-gray-800 shadow-xs'
                    : 'hover:shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">{cfg.icon}</span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                    remainingCount > 0
                      ? 'bg-red-600 text-white'
                      : 'bg-green-600 text-white'
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
