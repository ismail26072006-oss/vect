import { UserProfile, CourseSchedule, TaskItem } from '../types';

export const initialUser: UserProfile = {
  nim: '04102425006',
  name: 'ISMAIL K. ZAKARIA',
  email: '04102425006@mahasiswa.ung.ac.id',
  role: 'KETUA_KELAS',
  prodi: 'S1 MATEMATIKA',
  fakultas: 'Matematika dan Ilmu Pengetahuan Alam',
  semester: 4,
  angkatan: '2024',
  dosenWali: 'Dr. Ir. Mohamad Syafri, M.T.',
  statusAkademik: 'AKTIF',
  ipk: 3.85,
  sksSelesai: 48,
  sksTotal: 144,
  tunggakan: 0,
};

export const initialSchedules: CourseSchedule[] = [];

export const initialTasks: TaskItem[] = [];

