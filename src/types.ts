export type UserRole = 'KETUA_KELAS' | 'MAHASISWA';

export interface UserProfile {
  nim: string;
  name: string;
  email: string;
  role: UserRole;
  prodi: string;
  fakultas: string;
  semester: number;
  angkatan: string;
  dosenWali: string;
  statusAkademik: string;
  ipk: number;
  sksSelesai: number;
  sksTotal: number;
  tunggakan: number;
}

export interface CourseSchedule {
  id: string;
  courseName: string;
  courseCode: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  lecturer: string;
  sks: number;
}

export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  courseName: string;
  dueDate: string;
  dueTime: string;
  priority: TaskPriority;
  isCompleted: boolean;
  isClassTask: boolean;
  createdAt: string;
}

export type DashboardTab = 'semua' | 'jadwal' | 'tugas' | 'kalender';

export type NavPage = 
  | 'dashboard' 
  | 'biodata' 
  | 'kurikulum' 
  | 'biaya' 
  | 'perkuliahan' 
  | 'elearning' 
  | 'mbkm' 
  | 'kuesioner' 
  | 'decision' 
  | 'bantuan';
