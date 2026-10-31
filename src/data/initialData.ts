import { UserProfile, CourseSchedule, TaskItem } from '../types';

export const initialUser: UserProfile = {
  nim: '04102425006',
  name: 'Ismail K. Zakaria',
  email: '04102425006@mahasiswa.ung.ac.id',
  role: 'MAHASISWA',
  prodi: 'Pendidikan Teknologi Informasi',
  fakultas: 'Teknik',
  semester: 4,
  angkatan: '2024',
  dosenWali: 'Dr. Ir. Mohamad Syafri, M.T.',
  statusAkademik: 'AKTIF',
  ipk: 3.48,
  sksSelesai: 40,
  sksTotal: 144,
  tunggakan: 0,
};

export const initialSchedules: CourseSchedule[] = [];

export const initialTasks: TaskItem[] = [];

