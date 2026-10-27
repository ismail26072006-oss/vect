import React, { useState } from 'react';
import { UserProfile, ClassInfo } from '../types';
import { verifyClassCode, createNewClass, DEFAULT_CLASS_INFO } from '../services/firebaseSyncService';
import { 
  KeyRound, 
  PlusCircle, 
  School, 
  Users, 
  ArrowRight, 
  Sparkles, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface ClassGateScreenProps {
  user: UserProfile;
  onClassJoined: (classInfo: ClassInfo) => void;
  onLogout: () => void;
}

export const ClassGateScreen: React.FC<ClassGateScreenProps> = ({
  user,
  onClassJoined,
  onLogout,
}) => {
  const isKetuaKelas = user.role === 'KETUA_KELAS';
  const [activeMode, setActiveMode] = useState<'join' | 'create'>('join');

  // Join form state
  const [classCodeInput, setClassCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Create form state (Ketua Kelas)
  const [newClassName, setNewClassName] = useState('Pendidikan Teknologi Informasi - Kelas B 2024');
  const [newClassProdi, setNewClassProdi] = useState(user.prodi || 'Pendidikan Teknologi Informasi');
  const [newClassAngkatan, setNewClassAngkatan] = useState(user.angkatan || '2024');
  const [newClassCode, setNewClassCode] = useState('PTI-2024B');
  const [createError, setCreateError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Generate random class code
  const handleGenerateCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setNewClassCode(`PTI-${randomNum}`);
  };

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError('');
    const code = classCodeInput.trim().toUpperCase();

    if (!code) {
      setJoinError('Silakan masukkan kode kelas perkuliahan Anda.');
      return;
    }

    setIsJoining(true);
    try {
      const res = await verifyClassCode(code);
      if (res.exists && res.classInfo) {
        onClassJoined(res.classInfo);
      } else {
        // If not found, provide clear advice
        setJoinError(`Kode kelas "${code}" tidak ditemukan. Silakan periksa kembali atau gunakan kode default "PTI-2024A".`);
      }
    } catch (err) {
      setJoinError('Gagal memverifikasi kode kelas. Periksa koneksi internet Anda.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');

    if (!newClassName.trim()) {
      setCreateError('Nama kelas tidak boleh kosong.');
      return;
    }
    if (!newClassCode.trim()) {
      setCreateError('Kode kelas tidak boleh kosong.');
      return;
    }

    setIsCreating(true);
    try {
      const code = newClassCode.trim().toUpperCase();
      const newInfo: ClassInfo = {
        code,
        name: newClassName.trim(),
        prodi: newClassProdi.trim(),
        angkatan: newClassAngkatan.trim(),
        createdBy: user.nim,
        creatorName: user.name,
        createdAt: new Date().toISOString()
      };

      await createNewClass(newInfo);
      onClassJoined(newInfo);
    } catch (err) {
      setCreateError('Gagal membuat kelas baru. Silakan coba lagi.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between items-center px-4 py-8">
      <div className="w-full max-w-md my-auto">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-600 text-white shadow-md flex items-center justify-center font-black text-3xl mb-3">
            Σ
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wider text-red-600">
            VECTOREAL EDUCATION
          </h1>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-0.5">
            Portal Akademik Mahasiswa UNG
          </p>

          {/* User badge */}
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-2xs text-xs">
            <span className="text-gray-600">Login sebagai:</span>
            <strong className="text-gray-900">{user.name}</strong>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isKetuaKelas ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {isKetuaKelas ? '👑 Ketua Kelas' : '🎓 Mahasiswa'}
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-7">
          {/* Header Title */}
          <div className="text-center mb-5">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              {isKetuaKelas
                ? activeMode === 'join' ? 'Pilih Akses Kelas Perkuliahan' : 'Tambah & Buat Kelas Baru'
                : 'Masuk ke Kelas Perkuliahan'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {isKetuaKelas
                ? 'Kelola ruang kelas Anda atau gabung ke kode kelas yang telah dibuat.'
                : 'Masukkan kode kelas yang dibagikan oleh Ketua Kelas Anda.'}
            </p>
          </div>

          {/* Mode Switcher for Ketua Kelas */}
          {isKetuaKelas && (
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-xl mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setActiveMode('join');
                  setJoinError('');
                }}
                className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeMode === 'join'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Gabung Kode Kelas</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMode('create');
                  setCreateError('');
                }}
                className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeMode === 'create'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Buat Kelas Baru</span>
              </button>
            </div>
          )}

          {/* OPTION 1: JOIN CLASS WITH CODE */}
          {activeMode === 'join' && (
            <form onSubmit={handleJoinClass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
                  <span>Kode Kelas Perkuliahan:</span>
                  <span className="text-[10px] text-gray-400">Format: PTI-XXXX</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={classCodeInput}
                    onChange={(e) => {
                      setClassCodeInput(e.target.value);
                      if (joinError) setJoinError('');
                    }}
                    placeholder="Contoh: PTI-2024A"
                    className="w-full pl-10 pr-3 py-2.5 text-sm uppercase tracking-wider font-mono font-bold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50/50 hover:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Quick default class shortcut button */}
              <div className="p-3 rounded-xl bg-red-50/70 border border-red-100 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-red-900 truncate">
                    Kelas Utama: {DEFAULT_CLASS_INFO.code}
                  </p>
                  <p className="text-[10px] text-red-700 truncate">
                    {DEFAULT_CLASS_INFO.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setClassCodeInput(DEFAULT_CLASS_INFO.code)}
                  className="px-2.5 py-1 text-[11px] font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-2xs shrink-0 transition-colors"
                >
                  Gunakan
                </button>
              </div>

              {joinError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{joinError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isJoining}
                className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isJoining ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menghubungkan ke Kelas...</span>
                  </>
                ) : (
                  <>
                    <span>Gabung & Masuk ke Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* OPTION 2: CREATE NEW CLASS (Ketua Kelas Only) */}
          {isKetuaKelas && activeMode === 'create' && (
            <form onSubmit={handleCreateClass} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nama Kelas</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Contoh: Pendidikan Teknologi Informasi - Kelas B"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Program Studi</label>
                  <input
                    type="text"
                    value={newClassProdi}
                    onChange={(e) => setNewClassProdi(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Angkatan</label>
                  <input
                    type="text"
                    value={newClassAngkatan}
                    onChange={(e) => setNewClassAngkatan(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-gray-700">Kode Kelas Baru</label>
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="text-[10px] text-red-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Acak Kode</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={newClassCode}
                  onChange={(e) => setNewClassCode(e.target.value.toUpperCase())}
                  placeholder="Contoh: PTI-2024B"
                  className="w-full px-3 py-2 uppercase font-mono font-bold tracking-wider border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Bagikan kode ini kepada seluruh mahasiswa kelas agar dapat bergabung secara otomatis.
                </p>
              </div>

              {createError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{createError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isCreating}
                className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Membuat Kelas di Firebase...</span>
                  </>
                ) : (
                  <>
                    <span>Buat Kelas & Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Switch Account button */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Salah akun login?</span>
            <button
              onClick={onLogout}
              className="text-red-600 hover:underline font-bold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar / Ganti Akun</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 mt-6 space-y-1">
        <p className="font-medium text-gray-500">
          Vectoreal Education • Sistem Informasi Akademik Terintegrasi Firebase
        </p>
        <p className="text-[11px]">
          Universitas Negeri Gorontalo • Sinkronisasi Data Real-Time
        </p>
      </footer>
    </div>
  );
};
