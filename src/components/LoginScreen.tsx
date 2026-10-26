import React, { useState } from 'react';
import { UserRole } from '../types';
import { ShieldCheck, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [nim, setNim] = useState('04102425006');
  const [password, setPassword] = useState('••••••••••');
  const [role, setRole] = useState<UserRole>('KETUA_KELAS');
  const [isHumanVerified, setIsHumanVerified] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(role);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between items-center px-4 py-8">
      <div className="w-full max-w-md my-auto">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-20 h-20 rounded-full bg-white shadow-md border-2 border-red-600 flex items-center justify-center p-2 mb-3">
            <img 
              src="/assets/logo_sigma.png" 
              alt="Logo Vectoreal Education" 
              className="w-full h-full object-contain"
              onError={(e) => {
                // fallback to SVG sigma icon
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-2xl font-black text-red-600 hidden">Σ</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-wider text-red-600">
            VECTOREAL EDUCATION
          </h1>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-0.5">
            Sistem Informasi Akademik • UNG
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Masuk Sebagai Mahasiswa</h2>
            <p className="text-xs text-gray-500 mt-1">
              Gunakan NIM dan kata sandi akun portal Anda
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selector Pill */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Hak Akses Masuk:
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setRole('KETUA_KELAS')}
                  className={`py-2 rounded-md transition-all ${
                    role === 'KETUA_KELAS'
                      ? 'bg-red-600 text-white font-bold shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  👑 Ketua Kelas
                </button>
                <button
                  type="button"
                  onClick={() => setRole('MAHASISWA')}
                  className={`py-2 rounded-md transition-all ${
                    role === 'MAHASISWA'
                      ? 'bg-red-600 text-white font-bold shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🎓 Mahasiswa
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                {role === 'KETUA_KELAS' 
                  ? '• Akses Ketua: Mengatur jadwal MK, menambah & siarkan tugas kelas.'
                  : '• Akses Mahasiswa: Melihat jadwal, kalender, dan menandai tugas selesai.'}
              </p>
            </div>

            {/* NIM Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nomor Induk Mahasiswa (NIM)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono"
                  placeholder="Contoh: 04102425006"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Cloudflare Turnstile Box */}
            <div 
              onClick={() => setIsHumanVerified(!isHumanVerified)}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
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
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk ke Sistem</span>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <a href="#help" className="text-xs text-red-600 hover:underline font-medium">
              Lupa kata sandi atau bantuan login?
            </a>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="text-center text-xs text-gray-400 mt-8 space-y-1">
        <p className="font-medium text-gray-500">
          Vectoreal Education • Universitas Negeri Gorontalo
        </p>
        <p className="text-[11px]">
          Terintegrasi dengan Pangkalan Data Pendidikan Tinggi (PDDikti) Kemendikbudristek RI
        </p>
      </footer>
    </div>
  );
};
