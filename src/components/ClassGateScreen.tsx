import React, { useState } from 'react';
import { UserProfile, ClassInfo, NimRestriction } from '../types';
import { 
  verifyClassCode, 
  createNewClass, 
  DEFAULT_CLASS_INFO,
  isNimAllowedInClass 
} from '../services/firebaseSyncService';
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
  Shield,
  ShieldCheck,
  ShieldAlert,
  Hash,
  SlidersHorizontal,
  Info
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

  // NIM Restriction feature for Ketua Kelas
  const initialPrefix = user.nim && user.nim.length >= 8 
    ? user.nim.slice(0, user.nim.length - 3) 
    : '04102425';

  const [enableNimRestriction, setEnableNimRestriction] = useState(true);
  const [nimPrefix, setNimPrefix] = useState(initialPrefix); // 8-10 digit tetap angkatan
  const [rangeStart, setRangeStart] = useState<number | string>(1); // 1-3 digit per orang
  const [rangeEnd, setRangeEnd] = useState<number | string>(35);
  const [digitLength, setDigitLength] = useState<number>(3); // 2 or 3 digits (e.g. 01 vs 001)

  // Generate random class code
  const handleGenerateCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setNewClassCode(`PTI-${randomNum}`);
  };

  // Live calculation for preview
  const startNum = Math.max(0, parseInt(String(rangeStart), 10) || 1);
  const endNum = Math.max(startNum, parseInt(String(rangeEnd), 10) || 1);
  const totalStudents = endNum - startNum + 1;
  const sampleStart = `${nimPrefix}${String(startNum).padStart(digitLength, '0')}`;
  const sampleEnd = `${nimPrefix}${String(endNum).padStart(digitLength, '0')}`;

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
        // Validate NIM restriction
        const check = isNimAllowedInClass(user.nim, res.classInfo);
        if (!check.allowed) {
          setJoinError(
            check.reason || 
            `Akses Ditolak: NIM Anda (${user.nim}) tidak termasuk dalam daftar mahasiswa yang diizinkan untuk kelas ${res.classInfo.name}.`
          );
          setIsJoining(false);
          return;
        }

        onClassJoined(res.classInfo);
      } else {
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

    // NIM Restriction validation
    let nimRestrictionConfig: NimRestriction | undefined = undefined;
    if (enableNimRestriction) {
      const cleanPrefix = nimPrefix.trim();
      if (!cleanPrefix) {
        setCreateError('Digit NIM tetap angkatan wajib diisi jika pembatasan NIM diaktifkan.');
        return;
      }
      if (cleanPrefix.length < 6 || cleanPrefix.length > 12) {
        setCreateError('Digit NIM tetap angkatan biasanya terdiri dari 8 hingga 10 digit angka.');
        return;
      }
      if (isNaN(startNum) || isNaN(endNum) || startNum > endNum) {
        setCreateError('Interval nomor urut NIM tidak valid. Pastikan nomor mulai lebih kecil atau sama dengan nomor akhir.');
        return;
      }

      nimRestrictionConfig = {
        enabled: true,
        nimPrefix: cleanPrefix,
        rangeStart: startNum,
        rangeEnd: endNum,
        digitLength: digitLength
      };
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
        createdAt: new Date().toISOString(),
        nimRestriction: nimRestrictionConfig
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
      <div className="w-full max-w-lg my-auto">
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
            <span className="text-gray-600">Login:</span>
            <strong className="text-gray-900">{user.name}</strong>
            <span className="font-mono text-gray-500 font-semibold">({user.nim})</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isKetuaKelas ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {isKetuaKelas ? '👑 Ketua Kelas' : '🎓 Mahasiswa'}
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-7">
          {/* Header Title */}
          <div className="text-center mb-5">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              {isKetuaKelas
                ? activeMode === 'join' ? 'Pilih Akses Ruang Kelas' : 'Tambah & Buat Kelas Baru'
                : 'Masuk ke Ruang Kelas Perkuliahan'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {isKetuaKelas
                ? activeMode === 'join' 
                  ? 'Gabung ke kode kelas yang telah ada atau buat ruang kelas baru di bawah.'
                  : 'Atur kelas baru dan proteksi keamanan akses menggunakan filter interval NIM.'
                : 'Masukkan kode kelas perkuliahan Anda. Sistem akan memvalidasi izin NIM Anda.'}
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
                  setCreateError('');
                }}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeMode === 'join'
                    ? 'bg-white text-gray-900 shadow-xs font-extrabold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Gabung Kode Kelas</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMode('create');
                  setJoinError('');
                  setCreateError('');
                }}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeMode === 'create'
                    ? 'bg-red-600 text-white shadow-xs font-extrabold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Buat Kelas Baru</span>
              </button>
            </div>
          )}

          {/* OPTION 1: JOIN WITH CLASS CODE (For Mahasiswa and Ketua Kelas) */}
          {activeMode === 'join' && (
            <form onSubmit={handleJoinClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Masukkan Kode Kelas Perkuliahan
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

              {/* NIM Verification Info Box */}
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Verifikasi Akses NIM Otomatis</span>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    NIM Anda: <span className="font-mono font-bold text-blue-900">{user.nim}</span>. Sistem akan memastikan NIM Anda berada dalam rentang angkatan yang diizinkan oleh Ketua Kelas.
                  </p>
                </div>
              </div>

              {/* Quick default class shortcut button */}
              <div className="p-3 rounded-xl bg-red-50/70 border border-red-100 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] font-bold text-red-900 truncate">
                      Kelas Demo: {DEFAULT_CLASS_INFO.code}
                    </p>
                    <span className="text-[9px] bg-red-200 text-red-800 font-bold px-1.5 py-0.2 rounded">
                      NIM Terproteksi
                    </span>
                  </div>
                  <p className="text-[10px] text-red-700 truncate mt-0.5">
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
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Gagal Bergabung ke Kelas</p>
                    <p className="text-[11px] leading-relaxed text-red-600">{joinError}</p>
                  </div>
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
                    <span>Memverifikasi Akses Kelas & NIM...</span>
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

          {/* OPTION 2: CREATE NEW CLASS (Ketua Kelas Only) with NIM interval separation */}
          {isKetuaKelas && activeMode === 'create' && (
            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nama Kelas Perkuliahan</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Contoh: Pendidikan Teknologi Informasi - Kelas B 2024"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500"
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
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Angkatan</label>
                  <input
                    type="text"
                    value={newClassAngkatan}
                    onChange={(e) => setNewClassAngkatan(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-gray-700">Kode Unik Kelas Baru</label>
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
                  className="w-full px-3 py-2 uppercase font-mono font-bold tracking-wider text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              {/* SECTION: NIM SECURITY & RESTRICTION */}
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-700" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">
                        Proteksi Akses Mahasiswa Berdasarkan NIM
                      </h4>
                      <p className="text-[10px] text-gray-500">
                        Cegah kelas dimasuki sembarang orang di luar angkatan
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableNimRestriction}
                      onChange={(e) => setEnableNimRestriction(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                {enableNimRestriction && (
                  <div className="pt-2 border-t border-amber-200/70 space-y-3">
                    {/* Part 1: Fixed NIM Prefix (8-10 Digits) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-gray-800 text-[11px] flex items-center gap-1">
                          <Hash className="w-3.5 h-3.5 text-red-600" />
                          <span>1. Digit Tetap Angkatan/Prodi (8-10 Digit Pertama)</span>
                        </label>
                        <span className="text-[10px] font-mono font-bold text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                          {nimPrefix.length} Digit
                        </span>
                      </div>
                      <input
                        type="text"
                        value={nimPrefix}
                        onChange={(e) => setNimPrefix(e.target.value.replace(/\D/g, ''))}
                        placeholder="Contoh: 04102425"
                        maxLength={12}
                        className="w-full px-3 py-2 font-mono font-bold text-xs tracking-wider border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                        required={enableNimRestriction}
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        Angka tetap yang identik untuk seluruh mahasiswa dalam satu angkatan/prodi.
                      </p>
                    </div>

                    {/* Part 2: Individual Sequence Interval (1-3 Digits) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-gray-800 text-[11px] flex items-center gap-1">
                          <SlidersHorizontal className="w-3.5 h-3.5 text-red-600" />
                          <span>2. Interval Nomor Urut Mahasiswa (1-3 Digit Terakhir)</span>
                        </label>
                        {/* Format selector */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setDigitLength(2)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              digitLength === 2 ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            2 Digit (01-30)
                          </button>
                          <button
                            type="button"
                            onClick={() => setDigitLength(3)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              digitLength === 3 ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            3 Digit (001-030)
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] font-medium text-gray-600 block mb-0.5">
                            Dari (Nomor Urut Awal):
                          </span>
                          <input
                            type="number"
                            min="0"
                            max="999"
                            value={rangeStart}
                            onChange={(e) => setRangeStart(e.target.value)}
                            className="w-full px-3 py-2 font-mono font-bold text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                            required={enableNimRestriction}
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-medium text-gray-600 block mb-0.5">
                            Sampai (Nomor Urut Akhir):
                          </span>
                          <input
                            type="number"
                            min="0"
                            max="999"
                            value={rangeEnd}
                            onChange={(e) => setRangeEnd(e.target.value)}
                            className="w-full px-3 py-2 font-mono font-bold text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                            required={enableNimRestriction}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Live Preview Box */}
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                          ✓ Pratinjau Izin Akses ({totalStudents} Mahasiswa)
                        </span>
                        <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">
                          Interval Aktif
                        </span>
                      </div>
                      <p className="text-[11px] font-mono font-bold text-emerald-900 truncate">
                        {sampleStart} s/d {sampleEnd}
                      </p>
                      <p className="text-[10px] text-emerald-700">
                        Mahasiswa dengan NIM di luar rentang ini otomatis tidak dapat bergabung ke kelas.
                      </p>
                    </div>
                  </div>
                )}
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
                    <span>Menyimpan Kelas & Aturan NIM di Firebase...</span>
                  </>
                ) : (
                  <>
                    <span>Buat Kelas Terproteksi & Masuk</span>
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
          Universitas Negeri Gorontalo • Proteksi Akses NIM & Sinkronisasi Data Real-Time
        </p>
      </footer>
    </div>
  );
};
