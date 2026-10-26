import React from 'react';
import { UserProfile } from '../types';
import { 
  User, 
  Mail, 
  BookOpen, 
  Building2, 
  Calendar, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';

interface BiodataViewProps {
  user: UserProfile;
  onBack: () => void;
}

export const BiodataView: React.FC<BiodataViewProps> = ({ user, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-12">
      {/* Top action */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-2xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Dashboard</span>
      </button>

      {/* Main Biodata Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-red-700 via-red-600 to-red-800 p-6 flex items-end">
          <div className="flex items-center gap-3">
            <span className="text-white text-xs font-semibold px-2.5 py-0.5 rounded-full bg-black/20">
              PDDikti Kemendikbudristek RI
            </span>
            <span className="text-white text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-600/80 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Data Valid & Terverifikasi
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-xl bg-white border-4 border-white shadow-md text-red-600 font-extrabold flex items-center justify-center text-2xl bg-red-50">
                IK
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{user.name}</h1>
                <p className="text-xs font-mono text-gray-500 font-semibold">{user.nim}</p>
                <p className="text-xs text-red-600 font-medium">{user.prodi}</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
              Status: {user.statusAkademik}
            </span>
          </div>

          {/* Grid Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="font-bold text-gray-700 uppercase tracking-wider text-[11px] border-b border-gray-200 pb-2">
                Informasi Akademik
              </h3>
              
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Program Studi:</span>
                <span className="font-semibold text-gray-800">{user.prodi}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Fakultas:</span>
                <span className="font-semibold text-gray-800">{user.fakultas}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Jenjang:</span>
                <span className="font-semibold text-gray-800">Strata 1 (S1)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Angkatan Masuk:</span>
                <span className="font-semibold text-gray-800">{user.angkatan}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Semester Aktif:</span>
                <span className="font-semibold text-gray-800">Semester {user.semester}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Dosen Pembimbing Akademik:</span>
                <span className="font-semibold text-gray-800 text-right">{user.dosenWali}</span>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="font-bold text-gray-700 uppercase tracking-wider text-[11px] border-b border-gray-200 pb-2">
                Pencapaian & Administrasi
              </h3>

              <div className="flex justify-between py-1">
                <span className="text-gray-500">Indeks Prestasi Kumulatif (IPK):</span>
                <span className="font-bold text-red-600 text-sm">{user.ipk.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Total SKS Lulus:</span>
                <span className="font-semibold text-gray-800">{user.sksSelesai} dari {user.sksTotal} SKS</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Tunggakan UKT:</span>
                <span className="font-semibold text-green-700">Rp. 0 (Lunas)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Email Kampus:</span>
                <span className="font-mono text-gray-800">{user.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Peran Sistem:</span>
                <span className="font-bold text-amber-800">
                  {user.role === 'KETUA_KELAS' ? '👑 Ketua Kelas PTI' : '🎓 Mahasiswa Reguler'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
