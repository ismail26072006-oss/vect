import React from 'react';
import { NavPage } from '../types';
import { 
  LayoutDashboard, 
  User, 
  BookOpen, 
  CreditCard, 
  GraduationCap, 
  Laptop, 
  Award, 
  FileText, 
  PieChart, 
  HelpCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
}) => {
  const navItems = [
    { id: 'dashboard' as NavPage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'biodata' as NavPage, label: 'Biodata Mahasiswa', icon: User },
    { id: 'kurikulum' as NavPage, label: 'Kurikulum', icon: BookOpen },
    { id: 'biaya' as NavPage, label: 'Biaya Kuliah', icon: CreditCard },
    { id: 'perkuliahan' as NavPage, label: 'Perkuliahan', icon: GraduationCap },
    { id: 'elearning' as NavPage, label: 'E-Learning', icon: Laptop },
    { id: 'mbkm' as NavPage, label: 'MBKM', icon: Award },
    { id: 'kuesioner' as NavPage, label: 'Kuesioner', icon: FileText },
    { id: 'decision' as NavPage, label: 'Decision Support', icon: PieChart },
    { id: 'bantuan' as NavPage, label: 'Butuh Bantuan', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Drawer / Sidebar container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Brand Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-600 text-white font-black flex items-center justify-center shadow-xs">
              <span className="text-sm">Σ</span>
            </div>
            <div>
              <h2 className="text-xs font-black tracking-wider text-red-600">
                VECTOREAL EDUCATION
              </h2>
              <p className="text-[10px] text-gray-500 font-medium">
                Portal Akademik UNG
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-red-50 text-red-700 font-bold border-l-4 border-red-600 shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-3 border-t border-gray-100 bg-gray-50 text-[10px] text-gray-400 text-center">
          <p className="font-semibold text-gray-500">SIAKAD v2.6.4 (PDDikti)</p>
          <p>mahasiswa.vectoreal.education</p>
        </div>
      </aside>
    </>
  );
};
