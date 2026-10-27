import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, UserRole, ClassInfo } from '../types';
import { Menu, ChevronDown, User, LogOut, Shield, Check, School, RefreshCw, KeyRound } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  currentClass: ClassInfo | null;
  onToggleSidebar: () => void;
  onRoleChange: (newRole: UserRole) => void;
  onLogout: () => void;
  onOpenBiodata: () => void;
  onSwitchClass: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentClass,
  onToggleSidebar,
  onRoleChange,
  onLogout,
  onOpenBiodata,
  onSwitchClass,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shadow-xs">
      {/* Left section: Hamburger [=] | Selamat Datang */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-700 transition-colors focus:outline-none"
          title="Buka / Tutup Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="text-gray-300 font-light text-xl select-none hidden xs:inline">|</span>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm text-gray-800 tracking-tight">
              Selamat Datang, <strong className="text-red-700 font-bold">{user.name.toUpperCase()}</strong>
            </span>
            {currentClass && (
              <button
                onClick={onSwitchClass}
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors shadow-2xs"
                title="Klik untuk ganti atau cek ruang kelas"
              >
                <School className="w-3 h-3 text-emerald-600" />
                <span>Kelas: {currentClass.code}</span>
                {currentClass.nimRestriction?.enabled && (
                  <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1 py-0.2 rounded font-mono font-normal">
                    🔒 {currentClass.nimRestriction.nimPrefix}...
                  </span>
                )}
                <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1 rounded ml-0.5">Ganti</span>
              </button>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full w-max ${
              user.role === 'KETUA_KELAS' 
                ? 'bg-amber-50 text-amber-800 border border-amber-300' 
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {user.role === 'KETUA_KELAS' ? '👑 Ketua Kelas' : '🎓 Mahasiswa'}
            </span>

            {currentClass && (
              <span className="sm:hidden inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                🏫 {currentClass.code}
                {currentClass.nimRestriction?.enabled && ' (🔒 NIM)'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right section: Profile & Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center p-1 rounded-full hover:bg-gray-50 transition-all focus:outline-none"
          title="Menu Profil"
        >
          <div className="w-9 h-9 rounded-full bg-[#D32F2F] text-white font-bold flex items-center justify-center text-xs shadow-xs">
            IK
          </div>
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 text-xs">
            <div className="px-4 py-2.5 border-b border-gray-100">
              <p className="font-bold text-gray-800 text-sm">{user.name}</p>
              <p className="text-gray-500 font-mono text-[11px]">{user.nim}</p>
              <p className="text-gray-400 text-[11px] truncate">{user.prodi}</p>
            </div>

            {/* Switch Role Option */}
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Simulasi Hak Akses
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    onRoleChange('KETUA_KELAS');
                    setShowDropdown(false);
                  }}
                  className={`flex-1 py-1 px-2 rounded text-[11px] font-medium flex items-center justify-center gap-1 ${
                    user.role === 'KETUA_KELAS'
                      ? 'bg-red-600 text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {user.role === 'KETUA_KELAS' && <Check className="w-3 h-3" />}
                  Ketua Kelas
                </button>
                <button
                  onClick={() => {
                    onRoleChange('MAHASISWA');
                    setShowDropdown(false);
                  }}
                  className={`flex-1 py-1 px-2 rounded text-[11px] font-medium flex items-center justify-center gap-1 ${
                    user.role === 'MAHASISWA'
                      ? 'bg-red-600 text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {user.role === 'MAHASISWA' && <Check className="w-3 h-3" />}
                  Mahasiswa
                </button>
              </div>
            </div>

            <div className="py-1">
              {currentClass && (
                <button
                  onClick={() => {
                    onSwitchClass();
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4 text-emerald-600" />
                    <span>Ruang Kelas: <strong>{currentClass.code}</strong></span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Ganti</span>
                </button>
              )}
              <button
                onClick={() => {
                  onOpenBiodata();
                  setShowDropdown(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-gray-400" />
                <span>Biodata Mahasiswa (PDDikti)</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
