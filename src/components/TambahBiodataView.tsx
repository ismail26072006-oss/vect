import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { initialUser } from '../data/initialData';
import { 
  UserPlus, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Search, 
  Trash2, 
  AlertCircle,
  GraduationCap,
  Building2,
  Calendar,
  Award,
  BookOpen,
  UserCheck
} from 'lucide-react';

interface TambahBiodataViewProps {
  currentUser: UserProfile;
  onBack: () => void;
}

const ADMIN_NIM = '04102425006';

export const TambahBiodataView: React.FC<TambahBiodataViewProps> = ({
  currentUser,
  onBack,
}) => {
  const isAdmin = currentUser.nim === ADMIN_NIM;

  // Student list state (persisted)
  const [students, setStudents] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('siakad_registered_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      initialUser,
      {
        ...initialUser,
        nim: '04102425015',
        name: 'Rizky Pratama',
        email: '04102425015@mahasiswa.ung.ac.id',
        role: 'MAHASISWA',
        ipk: 3.82,
        sksSelesai: 42
      },
      {
        ...initialUser,
        nim: '04102425022',
        name: 'Siti Nurhaliza',
        email: '04102425022@mahasiswa.ung.ac.id',
        role: 'MAHASISWA',
        ipk: 3.90,
        sksSelesai: 45
      }
    ];
  });

  // Form state
  const [nim, setNim] = useState('');
  const [name, setName] = useState('');
  const [prodi, setProdi] = useState('Pendidikan Teknologi Informasi');
  const [fakultas, setFakultas] = useState('Fakultas Teknik');
  const [angkatan, setAngkatan] = useState('2024');
  const [semester, setSemester] = useState<number>(3);
  const [dosenWali, setDosenWali] = useState('Dr. H. Muchlis, S.Kom., M.T.');
  const [statusAkademik, setStatusAkademik] = useState('Aktif');
  const [ipk, setIpk] = useState<string>('3.75');
  const [sksSelesai, setSksSelesai] = useState<number>(42);
  const [sksTotal, setSksTotal] = useState<number>(144);
  const [role, setRole] = useState<'MAHASISWA' | 'KETUA_KELAS'>('MAHASISWA');

  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Persist students
  useEffect(() => {
    localStorage.setItem('siakad_registered_students', JSON.stringify(students));
  }, [students]);

  // If not admin, show restricted screen
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto space-y-5 pb-12 animate-fadeIn">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </button>

        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-gray-900">
              Akses Ditolak: Khusus Administrator
            </h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              Fitur <strong>Penambahan Biodata Mahasiswa PDDikti</strong> hanya dapat diakses oleh Administrator resmi dengan NIM <strong>{ADMIN_NIM}</strong>.
            </p>
          </div>

          <div className="inline-block p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs">
            <span className="text-gray-500">NIM Akun Anda Saat Ini: </span>
            <strong className="font-mono text-red-600 font-bold">{currentUser.nim}</strong>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Anda tidak memiliki wewenang untuk menambahkan biodata mahasiswa.
            </p>
          </div>

          <div>
            <button
              onClick={onBack}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
            >
              Kembali ke Menu Utama
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Add Student (Admin only)
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanNim = nim.trim();
    const cleanName = name.trim();

    if (!cleanNim) {
      setErrorMessage('NIM Mahasiswa wajib diisi.');
      return;
    }
    if (!cleanName) {
      setErrorMessage('Nama Mahasiswa wajib diisi.');
      return;
    }

    // Check duplicate NIM
    if (students.some((s) => s.nim === cleanNim)) {
      setErrorMessage(`Mahasiswa dengan NIM ${cleanNim} sudah terdaftar dalam sistem.`);
      return;
    }

    const parsedIpk = parseFloat(ipk) || 0;
    const newStudent: UserProfile = {
      nim: cleanNim,
      name: cleanName,
      email: `${cleanNim}@mahasiswa.ung.ac.id`,
      role: role,
      prodi,
      fakultas,
      semester,
      angkatan,
      dosenWali,
      statusAkademik,
      ipk: parsedIpk,
      sksSelesai,
      sksTotal,
      tunggakan: 0
    };

    setStudents((prev) => [newStudent, ...prev]);
    setSuccessMessage(`Biodata mahasiswa "${cleanName}" (${cleanNim}) berhasil ditambahkan ke database PDDikti!`);

    // Reset inputs
    setNim('');
    setName('');
    setIpk('3.75');
    setSksSelesai(42);
  };

  const handleDeleteStudent = (nimToDelete: string) => {
    if (nimToDelete === ADMIN_NIM) {
      alert('Akun Administrator tidak dapat dihapus.');
      return;
    }
    if (confirm(`Yakin ingin menghapus data mahasiswa dengan NIM ${nimToDelete}?`)) {
      setStudents((prev) => prev.filter((s) => s.nim !== nimToDelete));
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.prodi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-full text-xs font-bold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Admin Terverifikasi: {ADMIN_NIM}</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 p-6 text-white">
          <div className="flex items-center gap-2 text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-max mb-2">
            <UserPlus className="w-4 h-4" />
            <span>Portal Manajemen Biodata Mahasiswa PDDikti</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold">
            Penambahan Biodata Mahasiswa
          </h1>
          <p className="text-xs text-red-100 mt-1">
            Fitur khusus Admin (NIM: {ADMIN_NIM}) untuk mendaftarkan dan mengelola data resmi mahasiswa Universitas Negeri Gorontalo.
          </p>
        </div>

        {/* Form Section */}
        <div className="p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-red-600" />
            <span>Formulir Pendaftaran Mahasiswa Baru</span>
          </h3>

          <form onSubmit={handleAddStudent} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* NIM */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Nomor Induk Mahasiswa (NIM) <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={nim}
                  onChange={(e) => setNim(e.target.value.replace(/\s+/g, ''))}
                  placeholder="Contoh: 04102425025"
                  className="w-full px-3 py-2.5 font-mono font-bold text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Nama */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Nama Lengkap Mahasiswa <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Muhammad Fikri"
                  className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Prodi */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Program Studi</label>
                <input
                  type="text"
                  value={prodi}
                  onChange={(e) => setProdi(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Fakultas */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Fakultas</label>
                <input
                  type="text"
                  value={fakultas}
                  onChange={(e) => setFakultas(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Angkatan & Semester */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Angkatan</label>
                  <input
                    type="text"
                    value={angkatan}
                    onChange={(e) => setAngkatan(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={semester}
                    onChange={(e) => setSemester(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              {/* Dosen Wali */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Dosen Wali</label>
                <input
                  type="text"
                  value={dosenWali}
                  onChange={(e) => setDosenWali(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* IPK & SKS */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">IPK</label>
                  <input
                    type="text"
                    value={ipk}
                    onChange={(e) => setIpk(e.target.value)}
                    placeholder="3.75"
                    className="w-full px-3 py-2.5 text-xs font-mono border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">SKS Selesai</label>
                  <input
                    type="number"
                    value={sksSelesai}
                    onChange={(e) => setSksSelesai(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Total SKS</label>
                  <input
                    type="number"
                    value={sksTotal}
                    onChange={(e) => setSksTotal(parseInt(e.target.value, 10) || 144)}
                    className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              {/* Peran / Role */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Peran Akun</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                >
                  <option value="MAHASISWA">🎓 Mahasiswa Biasa</option>
                  <option value="KETUA_KELAS">👑 Ketua Kelas</option>
                </select>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Simpan Biodata Mahasiswa</span>
            </button>
          </form>
        </div>

        {/* Registered Students Table / List */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Daftar Mahasiswa Terdaftar ({students.length})
              </h3>
              <p className="text-xs text-gray-500">
                Data sinkron dengan pangkalan data SIAKAD UNG
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari NIM atau Nama..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-4 py-3">NIM</th>
                  <th className="px-4 py-3">Nama Mahasiswa</th>
                  <th className="px-4 py-3">Program Studi</th>
                  <th className="px-4 py-3">Peran</th>
                  <th className="px-4 py-3">IPK</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((std) => (
                  <tr key={std.nim} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-gray-900">
                      {std.nim}
                      {std.nim === ADMIN_NIM && (
                        <span className="ml-1.5 px-1.5 py-0.2 text-[9px] bg-red-100 text-red-800 font-bold rounded">
                          ADMIN
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{std.name}</td>
                    <td className="px-4 py-3 text-gray-500 truncate max-w-xs">{std.prodi}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        std.role === 'KETUA_KELAS'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {std.role === 'KETUA_KELAS' ? '👑 Ketua' : '🎓 Mahasiswa'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-600">{std.ipk}</td>
                    <td className="px-4 py-3 text-right">
                      {std.nim !== ADMIN_NIM && (
                        <button
                          onClick={() => handleDeleteStudent(std.nim)}
                          className="p-1 rounded text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                          title="Hapus data mahasiswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
