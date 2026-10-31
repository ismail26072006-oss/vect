import React, { useState, useEffect, useRef } from 'react';
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
  FileText,
  AlertCircle,
  UserCheck,
  User,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

export interface DeviceAccount {
  nim: string;
  name: string;
  role: UserRole;
  prodi: string;
  fakultas: string;
  angkatan: string;
  lastLogin: string;
  ktmImageUrl?: string;
}

interface LoginScreenProps {
  onLogin: (role: UserRole, nim: string, studentName?: string) => void;
  defaultNim?: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  onLogin, 
  defaultNim = '04102425006' 
}) => {
  // Load previously logged-in accounts on THIS device only (No dummy/unregistered names)
  const [deviceAccounts, setDeviceAccounts] = useState<DeviceAccount[]>(() => {
    try {
      const saved = localStorage.getItem('siakad_device_logged_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse device accounts:', e);
    }
    // Default initial verified account from the official attached KTM
    return [
      {
        nim: '04102425006',
        name: 'ISMAIL K. ZAKARIA',
        role: 'KETUA_KELAS',
        prodi: 'S1 MATEMATIKA',
        fakultas: 'Fakultas MIPA / Teknik',
        angkatan: '2024',
        lastLogin: new Date().toISOString(),
        ktmImageUrl: '/assets/ktm_ismail.png'
      }
    ];
  });

  // Active student identity for login
  const [currentNim, setCurrentNim] = useState('04102425006');
  const [currentName, setCurrentName] = useState('ISMAIL K. ZAKARIA');
  const [currentProdi, setCurrentProdi] = useState('S1 MATEMATIKA');
  const [currentRole, setCurrentRole] = useState<UserRole>('KETUA_KELAS');
  const [ktmImagePreview, setKtmImagePreview] = useState<string>('/assets/ktm_ismail.png');

  // Input tabs: 'ktm_upload' (scan/upload KTM) or 'manual_input' (input NIM)
  const [authMethod, setAuthMethod] = useState<'ktm_scan' | 'manual_input'>('ktm_scan');
  const [password, setPassword] = useState('••••••••••');
  const [isHumanVerified, setIsHumanVerified] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync device accounts to localStorage
  useEffect(() => {
    localStorage.setItem('siakad_device_logged_accounts', JSON.stringify(deviceAccounts));
  }, [deviceAccounts]);

  // Select a previously logged account on this device
  const handleSelectAccount = (acc: DeviceAccount) => {
    setCurrentNim(acc.nim);
    setCurrentName(acc.name);
    setCurrentProdi(acc.prodi);
    setCurrentRole(acc.role);
    setKtmImagePreview(acc.ktmImageUrl || '/assets/ktm_ismail.png');
    setScanMessage(`Akun ${acc.name} (${acc.nim}) siap diautentikasi.`);
  };

  // Remove saved account from this device
  const handleRemoveAccount = (nimToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeviceAccounts((prev) => prev.filter((a) => a.nim !== nimToRemove));
  };

  // Handle KTM file upload (PDF or Images)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanMessage('');

    // If image, create blob URL for preview
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setKtmImagePreview(url);
    } else {
      setKtmImagePreview('/assets/ktm_ismail.png');
    }

    // Simulate smart OCR scan reading KTM credentials from uploaded card
    setTimeout(() => {
      setIsScanning(false);
      setScanMessage(`✓ Berkas "${file.name}" berhasil dipindai & diverifikasi oleh sistem PDDikti.`);
    }, 800);
  };

  // Quick action: Use the official verified KTM from PDF
  const handleUseOfficialKtm = () => {
    setCurrentNim('04102425006');
    setCurrentName('ISMAIL K. ZAKARIA');
    setCurrentProdi('S1 MATEMATIKA');
    setCurrentRole('KETUA_KELAS');
    setKtmImagePreview('/assets/ktm_ismail.png');
    setScanMessage('✓ KTM Resmi UNG (Ismail K. Zakaria) dimuat dari berkas PDF terlampir.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const cleanNim = currentNim.trim() || '04102425006';
    const cleanName = currentName.trim() || 'ISMAIL K. ZAKARIA';

    // Save to device logged accounts
    const newDeviceAccount: DeviceAccount = {
      nim: cleanNim,
      name: cleanName,
      role: currentRole,
      prodi: currentProdi || 'Pendidikan Teknologi Informasi',
      fakultas: 'Universitas Negeri Gorontalo',
      angkatan: '2024',
      lastLogin: new Date().toISOString(),
      ktmImageUrl: ktmImagePreview
    };

    setDeviceAccounts((prev) => {
      const filtered = prev.filter((a) => a.nim !== cleanNim);
      return [newDeviceAccount, ...filtered];
    });

    setTimeout(() => {
      setIsLoading(false);
      onLogin(currentRole, cleanNim, cleanName);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between items-center px-4 py-6 sm:py-8">
      <div className="w-full max-w-md my-auto space-y-4">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md border-2 border-red-600 flex items-center justify-center p-2 mb-2">
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
          <h1 className="text-xl sm:text-2xl font-black tracking-wider text-red-600">
            VECTOREAL EDUCATION
          </h1>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-0.5">
            Portal Akademik • Universitas Negeri Gorontalo
          </p>
        </div>

        {/* Main Authentication Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 space-y-4">
          <div className="text-center">
            <h2 className="text-base sm:text-lg font-bold text-gray-800">
              Autentikasi Kartu Mahasiswa (KTM)
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Validasi identitas resmi mahasiswa Universitas Negeri Gorontalo
            </p>
          </div>

          {/* Device Saved Accounts (ONLY accounts that have actually logged in on this device) */}
          {deviceAccounts.length > 0 && (
            <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-red-600" />
                  <span>Akun Pernah Digunakan di Perangkat Ini:</span>
                </span>
                <span className="text-[10px] font-bold text-gray-400">
                  {deviceAccounts.length} Akun
                </span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {deviceAccounts.map((acc) => {
                  const isSelected = currentNim === acc.nim;
                  return (
                    <div
                      key={acc.nim}
                      onClick={() => handleSelectAccount(acc)}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-red-50 border-red-500 ring-1 ring-red-500/30 shadow-2xs'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-md bg-red-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          {acc.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {acc.name}
                          </p>
                          <p className="text-[10px] text-gray-500 truncate">
                            {acc.nim} • {acc.prodi}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          acc.role === 'KETUA_KELAS'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {acc.role === 'KETUA_KELAS' ? '👑 Ketua' : '🎓 Mahasiswa'}
                        </span>
                        {deviceAccounts.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => handleRemoveAccount(acc.nim, e)}
                            className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                            title="Hapus dari memori perangkat"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Method Tabs: Scan / Upload KTM vs Input Manual */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setAuthMethod('ktm_scan')}
              className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                authMethod === 'ktm_scan'
                  ? 'bg-white text-gray-900 shadow-xs font-extrabold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-red-600" />
              <span>Pindai / Unggah KTM</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('manual_input')}
              className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                authMethod === 'manual_input'
                  ? 'bg-white text-gray-900 shadow-xs font-extrabold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-red-600" />
              <span>Input Data Mahasiswa</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* METHOD 1: SCAN / UPLOAD KTM */}
            {authMethod === 'ktm_scan' && (
              <div className="space-y-3">
                {/* File Upload Zone */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 border-2 border-dashed border-red-300 hover:border-red-500 rounded-xl bg-red-50/20 text-center cursor-pointer transition-colors space-y-1 group"
                >
                  <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                    <Scan className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-gray-800">
                    Klik untuk Unggah Berkas KTM (PDF / Gambar)
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Sistem akan memverifikasi biodata dan nomor mahasiswa secara otomatis
                  </p>
                </div>

                {/* Quick button to load official attached KTM */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50/60 border border-red-100">
                  <div className="min-w-0 pr-2">
                    <p className="text-[11px] font-bold text-red-900 truncate">
                      Gunakan KTM Terlampir (Ismail K. Zakaria)
                    </p>
                    <p className="text-[10px] text-red-700">
                      S1 Matematika • UNG • NIM: 04102425006
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseOfficialKtm}
                    className="px-2.5 py-1 text-[10px] font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-2xs shrink-0 transition-colors"
                  >
                    Terapkan
                  </button>
                </div>

                {isScanning && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2 animate-pulse">
                    <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    <span>Memindai & memverifikasi berkas KTM ke server PDDikti...</span>
                  </div>
                )}

                {scanMessage && !isScanning && (
                  <div className="p-2.5 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <span>{scanMessage}</span>
                  </div>
                )}
              </div>
            )}

            {/* METHOD 2: MANUAL INPUT (For friends to test directly) */}
            {authMethod === 'manual_input' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Nama Lengkap Mahasiswa
                  </label>
                  <input
                    type="text"
                    value={currentName}
                    onChange={(e) => setCurrentName(e.target.value.toUpperCase())}
                    placeholder="Contoh: ISMAIL K. ZAKARIA"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-bold uppercase text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Nomor Induk Mahasiswa (NIM)
                  </label>
                  <input
                    type="text"
                    value={currentNim}
                    onChange={(e) => setCurrentNim(e.target.value.replace(/\s+/g, ''))}
                    placeholder="Contoh: 04102425006"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-mono font-bold text-gray-800"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Program Studi
                    </label>
                    <input
                      type="text"
                      value={currentProdi}
                      onChange={(e) => setCurrentProdi(e.target.value)}
                      placeholder="S1 MATEMATIKA"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Peran Hak Akses
                    </label>
                    <select
                      value={currentRole}
                      onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white font-bold"
                    >
                      <option value="KETUA_KELAS">👑 Ketua Kelas</option>
                      <option value="MAHASISWA">🎓 Mahasiswa</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* REAL DIGITAL KTM CARD DISPLAY (Matching the attached official PDF) */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-300 shadow-sm bg-white">
              {/* Header Banner UNG */}
              <div className="bg-[#D32F2F] px-4 py-2 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white text-red-700 flex items-center justify-center font-black text-xs">
                    Σ
                  </div>
                  <div>
                    <h3 className="text-[11px] font-black tracking-wider leading-none">
                      UNIVERSITAS NEGERI GORONTALO
                    </h3>
                    <p className="text-[9px] text-red-100 font-medium">
                      Kartu Tanda Mahasiswa Digital
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-bold bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                  Terverifikasi
                </span>
              </div>

              {/* Card Body */}
              <div className="p-3 sm:p-4 flex items-start gap-3">
                {/* Photo / Scanned Image */}
                <div className="w-20 h-24 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                  {ktmImagePreview ? (
                    <img 
                      src={ktmImagePreview} 
                      alt="Foto KTM Mahasiswa"
                      className="w-full h-full object-cover"
                      onError={() => setKtmImagePreview('/assets/ktm_ismail.png')}
                    />
                  ) : (
                    <div className="text-center p-1">
                      <User className="w-8 h-8 text-gray-400 mx-auto" />
                      <span className="text-[8px] text-gray-400 block mt-1">FOTO KTM</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">
                      Nama Mahasiswa
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-gray-900 truncate">
                      {currentName}
                    </h4>
                  </div>

                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">
                      NIM & Program Studi
                    </span>
                    <p className="text-xs font-mono font-bold text-red-700">
                      {currentNim}
                    </p>
                    <p className="text-[11px] font-semibold text-gray-700 truncate">
                      {currentProdi}
                    </p>
                  </div>

                  {/* Role Selector Badge */}
                  <div className="pt-1 flex items-center justify-between gap-1 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      currentRole === 'KETUA_KELAS'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-blue-100 text-blue-900 border border-blue-200'
                    }`}>
                      {currentRole === 'KETUA_KELAS' ? '👑 Ketua Kelas' : '🎓 Mahasiswa'}
                    </span>
                    <span className="text-[9px] font-mono text-gray-400">
                      Rektor: Prof. Dr. Ir. Eduart Wolok
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Kata Sandi Akun Portal
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

            {/* Human Verification */}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !isHumanVerified}
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi Identitas KTM...</span>
                </>
              ) : (
                <span>Masuk ke Sistem Portal Mahasiswa</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 mt-4 space-y-0.5">
        <p className="font-medium text-gray-500">
          Vectoreal Education • Universitas Negeri Gorontalo
        </p>
        <p className="text-[11px]">
          Sistem Terintegrasi Pangkalan Data Pendidikan Tinggi (PDDikti)
        </p>
      </footer>
    </div>
  );
};
