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
  classCode?: string;
}

export interface NimRestriction {
  enabled: boolean;
  nimPrefix: string;      // 8-10 digit prefix angkatan/prodi (e.g. "04102425" or "5314240")
  rangeStart: number;     // Starting individual student sequence number (e.g. 1)
  rangeEnd: number;       // Ending individual student sequence number (e.g. 35)
  digitLength: number;    // Length of sequence digits (e.g. 2 for "01-30" or 3 for "001-030")
}

export interface ClassInfo {
  code: string;
  name: string;
  prodi: string;
  angkatan: string;
  createdBy: string;
  creatorName: string;
  createdAt?: string;
  nimRestriction?: NimRestriction;
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  timestamp: number;
  taskId?: string;
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

export type TaskCategory = 'Study' | 'Work' | 'Personal' | 'Organization';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  courseName: string;
  category?: TaskCategory;
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
