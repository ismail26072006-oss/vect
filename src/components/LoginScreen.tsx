import React, { useState, useRef } from 'react';
import { UserRole } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Upload, 
  Scan, 
  CreditCard, 
  Sparkles, 
  Building2, 
  QrCode, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface StudentKtmProfile {
  nim: string;
  name: string;
  role: UserRole;
  prodi: string;
  fakultas: string;
  angkatan: string;
  status: string;
  avatarBg: string;
}

const PRESET_KTMS: StudentKtmProfile[] = [
  {
    nim: '04102425006',
    name: 'Ismail K. Zakaria',
    role: 'KETUA_KELAS',
    prodi: 'Pendidikan Teknologi Informasi',
    fakultas: 'Fakultas Teknik',
    angkatan: '2024',
    status: 'Aktif (PDDikti Terverifikasi)',
    avatarBg: 'bg-red-700'
  },
  {
    nim: '04102425015',
    name: 'Rizky Pratama',
    role: 'MAHASISWA',
    prodi: 'Pendidikan Teknologi Informasi',
    fakultas: 'Fakultas Teknik',
    angkatan: '2024',
    status: 'Aktif (PDDikti Terverifikasi)',
    avatarBg: 'bg-blue-700'
  },
  {
    nim: '04102425022',
    name: 'Siti Nurhaliza',
    role: 'MAHASISWA',
    prodi: 'Pendidikan Teknologi Informasi',
    fakultas: 'Fakultas Teknik',
    angkatan: '2024',
    status: 'Aktif (PDDikti Terverifikasi)',
    avatarBg: 'bg-emerald-700'
  },
  {
    nim: '04102425088',
    name: 'Budi Santoso',
    role: 'MAHASISWA',
    prodi: 'Pendidikan Teknologi Informasi',
    fakultas: 'Fakultas Teknik',
    angkatan: '2024',
    status: 'Aktif (Luar Interval Kelas)',
    avatarBg: 'bg-purple-700'
  }
];

interface LoginScreenProps {
  onLogin: (role: UserRole, nim: string, studentName?: string) => void;
  defaultNim?: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  onLogin, 
  defaultNim = '04102425006' 
}) => {
  // Active selected KTM profile (NIM is stored as data, not manual input)
  const [selectedKtm, setSelectedKtm] = useState<StudentKtmProfile>(() => {
    const match = PRESET_KTMS.find((k) => k.nim === defaultNim);
    return match || PRESET_KTMS[0];
  });

  const [activeTab, setActiveTab] = useState<'scan' | 'upload'>('scan');
  const [password, setPassword] = useState('••••••••••');
  const [isHumanVerified, setIsHumanVerified] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanningFile, setIsScanningFile] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle simulated KTM file upload & OCR validation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningFile(true);
    setUploadSuccess('');

    // Simulate OCR scanner reading KTM barcode and authenticating with PDDikti
    setTimeout(() => {
      setIsScanningFile(false);
      setUploadSuccess(`KTM "${file.name}" berhasil dipindai dan diverifikasi dengan PDDikti!`);
      // Randomly pick or maintain verified profile
      setSelectedKtm(PRESET_KTMS[0]);
    }, 900);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Pass verified student data to login handler
      onLogin(selectedKtm.role, selectedKtm.nim, selectedKtm.name);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between items-center px-4 py-8">
      <div className="w-full max-w-md my-auto">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-5 text-center">
          <div className="w-18 h-18 rounded-2xl bg-white shadow-md border-2 border-red-600 flex items-center justify-center p-2 mb-2.5">
            <img 
              src="/assets/logo_sigma.png" 
              alt="Logo Vectoreal Education" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-2xl font-black text-red-600 hidden">Σ</span>
          </div>
          <h1 className="text-2xl font-black tracking-wider text-red-600">
            VECTOREAL EDUCATION
          </h1>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-0.5">
            Portal Akademik • Universitas Negeri Gorontalo
          </p>
        </div>

        {/* Main Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-7">
          <div className="text-center mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-800">
              Autentikasi Kartu Mahasiswa (KTM)
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Validasi identitas otomatis menggunakan pemindaian KTM resmi UNG
            </p>
          </div>

          {/* Mode Switcher: Scan / Upload KTM */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-xl mb-4 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('scan')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'scan'
                  ? 'bg-white text-gray-900 shadow-xs font-extrabold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-red-600" />
              <span>Pilih / Tap KTM</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'upload'
                  ? 'bg-white text-gray-900 shadow-xs font-extrabold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-red-600" />
              <span>Unggah Foto KTM</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* TAB 1: QUICK KTM SELECTOR */}
            {activeTab === 'scan' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Pilih Kartu Tanda Mahasiswa yang Terbaca:
                </label>
                <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {PRESET_KTMS.map((ktm) => {
                    const isSelected = selectedKtm.nim === ktm.nim;
                    return (
                      <button
                        key={ktm.nim}
                        type="button"
                        onClick={() => setSelectedKtm(ktm)}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-red-50/80 border-red-500 ring-2 ring-red-500/20 shadow-2xs'
                            : 'bg-gray-50/60 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-lg ${ktm.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}>
                            {ktm.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">
                              {ktm.name}
                            </p>
                            <p className="text-[10px] text-gray-500 truncate">
                              {ktm.prodi} • Angkatan {ktm.angkatan}
                            </p>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          ktm.role === 'KETUA_KELAS'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {ktm.role === 'KETUA_KELAS' ? '👑 Ketua' : '🎓 Mahasiswa'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: UPLOAD KTM IMAGE */}
            {activeTab === 'upload' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Unggah Berkas / Foto KTM Mahasiswa:
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-5 border-2 border-dashed border-red-300 hover:border-red-500 rounded-xl bg-red-50/30 text-center cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                    <Scan className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-gray-800">
                    Klik untuk Ambil Foto atau Pilih Berkas KTM
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Mendukung format JPG, PNG, atau scan PDF Kartu Tanda Mahasiswa
                  </p>
                </div>

                {isScanningFile && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2 animate-pulse">
                    <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    <span>Memindai & memverifikasi data biodata ke PDDikti Kemendikbudristek...</span>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}
              </div>
            )}

            {/* VISUAL DIGITAL KTM CARD PREVIEW */}
            <div className="mt-3 relative rounded-2xl overflow-hidden border border-red-300 shadow-sm bg-gradient-to-br from-red-800 via-red-700 to-red-900 text-white p-4">
              {/* Card Watermark Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white text-red-700 font-black flex items-center justify-center text-xs shadow-xs">
                    Σ
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black tracking-wider leading-tight">
                      UNIVERSITAS NEGERI GORONTALO
                    </h4>
                    <p className="text-[8px] text-red-200 uppercase tracking-widest">
                      Kartu Tanda Mahasiswa Digital
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                  PDDikti Valid
                </span>
              </div>

              {/* Card Body */}
              <div className="pt-3 flex items-start gap-3">
                <div className="w-14 h-18 rounded-lg bg-white/10 border border-white/30 flex flex-col items-center justify-center font-bold text-xs shrink-0 shadow-inner">
                  <span className="text-xl">🎓</span>
                  <span className="text-[8px] text-red-200 mt-1 uppercase font-semibold">UNG</span>
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-[9px] text-red-200 uppercase tracking-wider font-semibold">
                    Nama Mahasiswa:
                  </p>
                  <h3 className="text-xs sm:text-sm font-black truncate leading-tight">
                    {selectedKtm.name}
                  </h3>

                  <p className="text-[9px] text-red-200 uppercase tracking-wider font-semibold pt-1">
                    Program Studi & Angkatan:
                  </p>
                  <p className="text-[11px] font-semibold text-white/95 truncate">
                    {selectedKtm.prodi} ({selectedKtm.angkatan})
                  </p>

                  <div className="pt-1.5 flex items-center justify-between gap-1 flex-wrap">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                      selectedKtm.role === 'KETUA_KELAS'
                        ? 'bg-amber-400 text-amber-950'
                        : 'bg-white text-red-800'
                    }`}>
                      {selectedKtm.role === 'KETUA_KELAS' ? '👑 Ketua Kelas' : '🎓 Mahasiswa'}
                    </span>
                    <span className="text-[9px] font-mono text-red-200">
                      ID: {selectedKtm.nim.slice(0, 4)}••••{selectedKtm.nim.slice(-3)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Kata Sandi Akun SIAKAD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Cloudflare Human Verification */}
            <div 
              onClick={() => setIsHumanVerified(!isHumanVerified)}
              className="flex items-center justify-between p-2.5 border border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isHumanVerified}
                  onChange={(e) => setIsHumanVerified(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                />
                <span className="text-xs text-gray-700 font-medium">
                  Verifikasi bahwa Anda adalah manusia
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
                <span>Cloudflare</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isHumanVerified}
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mengautentikasi KTM...</span>
                </>
              ) : (
                <span>Masuk ke Sistem Portal</span>
              )}
            </button>
          </form>

          <div className="mt-3.5 pt-3 border-t border-gray-100 text-center">
            <span className="text-xs text-gray-400">
              Butuh bantuan verifikasi KTM?{' '}
              <a href="#help" className="text-red-600 hover:underline font-bold">
                Bantuan SIAKAD
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="text-center text-xs text-gray-400 mt-6 space-y-1">
        <p className="font-medium text-gray-500">
          Vectoreal Education • Universitas Negeri Gorontalo
        </p>
        <p className="text-[11px]">
          Autentikasi Terintegrasi dengan PDDikti Kemendikbudristek RI
        </p>
      </footer>
    </div>
  );
};
