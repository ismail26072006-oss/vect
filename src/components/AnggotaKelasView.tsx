import React, { useState, useEffect } from 'react';
import { ClassInfo, UserProfile, ClassMember } from '../types';
import { 
  subscribeToClassMembers, 
  removeClassMember 
} from '../services/firebaseSyncService';
import { 
  Users, 
  ArrowLeft, 
  Search, 
  School, 
  ShieldCheck, 
  UserMinus, 
  Copy, 
  Check, 
  Calendar,
  Sparkles,
  UserCheck
} from 'lucide-react';

interface AnggotaKelasViewProps {
  classInfo: ClassInfo;
  currentUser: UserProfile;
  onBack: () => void;
}

export const AnggotaKelasView: React.FC<AnggotaKelasViewProps> = ({
  classInfo,
  currentUser,
  onBack,
}) => {
  const isKetuaKelas = currentUser.role === 'KETUA_KELAS' || currentUser.nim === classInfo.createdBy;
  const [members, setMembers] = useState<ClassMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Subscribe to class members in real-time
  useEffect(() => {
    if (!classInfo?.code) return;
    const unsub = subscribeToClassMembers(classInfo.code, (updatedList) => {
      setMembers(updatedList);
    });
    return () => unsub();
  }, [classInfo?.code]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(classInfo.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRemoveMember = async (memberNim: string, memberName: string) => {
    if (confirm(`Apakah Anda yakin ingin mengeluarkan ${memberName} (${memberNim}) dari kelas ${classInfo.name}?`)) {
      await removeClassMember(classInfo.code, memberNim);
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.prodi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-12 animate-fadeIn">
      {/* Top action row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold shadow-2xs transition-all"
            title="Salin kode kelas untuk dibagikan"
          >
            {copiedCode ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Kode Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gray-500" />
                <span>Salin Kode: <strong className="font-mono text-red-600">{classInfo.code}</strong></span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Class Banner Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
                <School className="w-3.5 h-3.5" />
                <span>Ruang Kelas • {classInfo.code}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black">
                {classInfo.name}
              </h1>
              <p className="text-xs text-red-100 mt-1">
                {classInfo.prodi} • Angkatan {classInfo.angkatan} • Ketua: <strong>{classInfo.creatorName}</strong>
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-center">
              <span className="text-xs text-red-200 block">Total Anggota</span>
              <span className="text-2xl font-black text-white">{members.length}</span>
              <span className="text-[10px] text-red-200 block">Mahasiswa</span>
            </div>
          </div>
        </div>

        {/* Member list section */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-red-600" />
                <span>Daftar Mahasiswa yang Telah Masuk Kelas ({filteredMembers.length})</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Sinkronisasi real-time via Firebase Firestore
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Nama atau NIM..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          {filteredMembers.length === 0 ? (
            <div className="p-10 text-center border-2 border-dashed border-gray-200 rounded-2xl space-y-2">
              <Users className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-gray-700">Belum Ada Mahasiswa yang Masuk</p>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Bagikan kode kelas <strong>{classInfo.code}</strong> kepada rekan mahasiswa untuk bergabung ke ruang kelas ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredMembers.map((member) => {
                const isLeader = member.role === 'KETUA_KELAS' || member.nim === classInfo.createdBy;
                const isMe = member.nim === currentUser.nim;

                return (
                  <div
                    key={member.nim}
                    className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isLeader
                        ? 'bg-amber-50/40 border-amber-200 shadow-2xs'
                        : isMe
                        ? 'bg-red-50/30 border-red-200 shadow-2xs'
                        : 'bg-white border-gray-200 hover:border-gray-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs ${
                        isLeader
                          ? 'bg-amber-600 text-white'
                          : isMe
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-bold text-gray-900 truncate">
                            {member.name}
                          </h4>
                          {isMe && (
                            <span className="text-[9px] bg-red-100 text-red-800 font-bold px-1.5 py-0.2 rounded">
                              Anda
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] font-mono text-gray-600 font-semibold mt-0.5">
                          {member.nim}
                        </p>

                        <p className="text-[10px] text-gray-400 truncate mt-0.5">
                          {member.prodi}
                        </p>

                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isLeader
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {isLeader ? '👑 Ketua Kelas' : '🎓 Mahasiswa'}
                          </span>

                          <span className="inline-flex items-center gap-1 text-[9px] text-emerald-700 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Aktif di Kelas
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ketua Kelas action: Remove member */}
                    {isKetuaKelas && !isLeader && !isMe && (
                      <button
                        onClick={() => handleRemoveMember(member.nim, member.name)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                        title="Keluarkan mahasiswa dari kelas"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
