import React from 'react';
import { ToastNotification } from '../types';
import { Bell, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  notifications: ToastNotification[];
  onDismiss: (id: string) => void;
  onAction?: (taskId?: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  notifications,
  onDismiss,
  onAction,
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-3 pointer-events-none">
      {notifications.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-fadeIn ${
            toast.type === 'urgent'
              ? 'bg-red-900/95 text-white border-red-700 shadow-red-950/20'
              : toast.type === 'warning'
              ? 'bg-amber-900/95 text-white border-amber-700'
              : toast.type === 'success'
              ? 'bg-green-900/95 text-white border-green-700'
              : 'bg-gray-900/95 text-white border-gray-700'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 shrink-0">
              {toast.type === 'urgent' ? (
                <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center animate-bounce">
                  <Bell className="w-4 h-4 text-white" />
                </div>
              ) : toast.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              ) : toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <Info className="w-5 h-5 text-blue-400" />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-xs font-bold leading-snug">{toast.title}</h4>
              <p className="text-[11px] text-gray-200 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
              {toast.taskId && onAction && (
                <button
                  onClick={() => onAction(toast.taskId)}
                  className="mt-2 px-2.5 py-1 text-[10px] font-bold bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors shadow-2xs"
                >
                  Lihat Tugas
                </button>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-gray-300 hover:text-white p-1 rounded-md transition-colors"
              title="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
