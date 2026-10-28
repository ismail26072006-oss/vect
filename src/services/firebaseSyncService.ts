import {
  db,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from '../firebase';
import { TaskItem, CourseSchedule, ClassInfo, UserProfile, ClassMember } from '../types';
import { initialSchedules, initialTasks } from '../data/initialData';

const DEFAULT_CLASS_CODE = 'PTI-2024A';

export const DEFAULT_CLASS_INFO: ClassInfo = {
  code: DEFAULT_CLASS_CODE,
  name: 'Pendidikan Teknologi Informasi - Kelas A 2024',
  prodi: 'Pendidikan Teknologi Informasi',
  angkatan: '2024',
  createdBy: '04102425006',
  creatorName: 'Ismail K. Zakaria',
  createdAt: new Date().toISOString(),
  nimRestriction: {
    enabled: true,
    nimPrefix: '04102425',
    rangeStart: 1,
    rangeEnd: 40,
    digitLength: 3
  }
};

/**
 * Validate whether a student's NIM is authorized to enter this class
 */
export function isNimAllowedInClass(
  nim: string,
  classInfo: ClassInfo
): { allowed: boolean; reason?: string } {
  if (!classInfo.nimRestriction || !classInfo.nimRestriction.enabled) {
    return { allowed: true };
  }

  const { nimPrefix, rangeStart, rangeEnd, digitLength } = classInfo.nimRestriction;
  const cleanNim = (nim || '').trim();
  const cleanPrefix = (nimPrefix || '').trim();

  // The class creator is always permitted
  if (classInfo.createdBy && cleanNim === classInfo.createdBy.trim()) {
    return { allowed: true };
  }

  // 1. Check fixed prefix (8-10 digit angkatan/prodi)
  if (!cleanNim.startsWith(cleanPrefix)) {
    return {
      allowed: false,
      reason: `NIM Anda (${cleanNim}) tidak sesuai dengan prefix NIM angkatan kelas ini (${cleanPrefix}...).`
    };
  }

  // 2. Check student individual sequence number (1-3 digit) within interval
  const suffixStr = cleanNim.slice(cleanPrefix.length);
  const sequenceNum = parseInt(suffixStr, 10);

  if (isNaN(sequenceNum)) {
    return {
      allowed: false,
      reason: `Digit nomor urut pada NIM Anda (${suffixStr}) tidak valid.`
    };
  }

  if (sequenceNum < rangeStart || sequenceNum > rangeEnd) {
    const padLen = digitLength || Math.max(suffixStr.length, 2);
    const startFmt = String(rangeStart).padStart(padLen, '0');
    const endFmt = String(rangeEnd).padStart(padLen, '0');
    return {
      allowed: false,
      reason: `Akses ditolak: Nomor urut NIM Anda (${suffixStr}) berada di luar rentang yang diizinkan untuk kelas ini (${cleanPrefix}${startFmt} s/d ${cleanPrefix}${endFmt}). Hubungi Ketua Kelas jika ada kekeliruan.`
    };
  }

  return { allowed: true };
}

/**
 * Verify whether a class code exists in Firestore or locally
 */
export async function verifyClassCode(code: string): Promise<{ exists: boolean; classInfo?: ClassInfo }> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { exists: false };

  // Check default class
  if (normalized === DEFAULT_CLASS_CODE) {
    return { exists: true, classInfo: DEFAULT_CLASS_INFO };
  }

  try {
    const classDocRef = doc(db, 'classes', normalized);
    const snap = await getDoc(classDocRef);
    if (snap.exists()) {
      return { exists: true, classInfo: snap.data() as ClassInfo };
    }
  } catch (error) {
    console.warn('Firestore verifyClassCode check failed, using local check:', error);
  }

  // Check localStorage classes
  try {
    const savedClasses = localStorage.getItem('siakad_custom_classes');
    if (savedClasses) {
      const parsed: Record<string, ClassInfo> = JSON.parse(savedClasses);
      if (parsed[normalized]) {
        return { exists: true, classInfo: parsed[normalized] };
      }
    }
  } catch (err) {
    console.error('Local class cache error:', err);
  }

  return { exists: false };
}

/**
 * Create a new class in Firestore (for Ketua Kelas)
 * Newly created classes start completely clean and empty with NO dummy tasks or schedules
 */
export async function createNewClass(
  classInfo: ClassInfo
): Promise<boolean> {
  const code = classInfo.code.trim().toUpperCase();

  try {
    // Save to Firestore classes collection
    const classDocRef = doc(db, 'classes', code);
    await setDoc(classDocRef, {
      ...classInfo,
      code,
      createdAt: new Date().toISOString(),
      updatedAt: serverTimestamp()
    });
    // Newly created class remains completely EMPTY - ready for the Ketua Kelas to add their own MK & tasks
  } catch (err) {
    console.warn('Firestore createNewClass offline or permission error, caching locally:', err);
  }

  // Also cache locally
  try {
    const saved = localStorage.getItem('siakad_custom_classes');
    const parsed = saved ? JSON.parse(saved) : {};
    parsed[code] = { ...classInfo, code };
    localStorage.setItem('siakad_custom_classes', JSON.stringify(parsed));
  } catch (e) {
    console.error('Failed to cache class locally:', e);
  }

  return true;
}

/**
 * Subscribe in real-time to tasks in a specific class
 */
export function subscribeToClassTasks(
  classCode: string,
  onTasksUpdated: (tasks: TaskItem[]) => void,
  fallbackTasks: TaskItem[]
): () => void {
  const code = classCode.trim().toUpperCase() || DEFAULT_CLASS_CODE;

  try {
    const tasksCollectionRef = collection(db, 'classes', code, 'tasks');
    const unsubscribe = onSnapshot(
      tasksCollectionRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: TaskItem[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as TaskItem);
          });
          onTasksUpdated(list);
        } else {
          // Only seed initial sample data for the default demo class PTI-2024A
          if (code === DEFAULT_CLASS_CODE) {
            seedDefaultClassTasks(code, fallbackTasks);
            onTasksUpdated(fallbackTasks);
          } else {
            // Newly created classes start completely empty
            onTasksUpdated([]);
          }
        }
      },
      (error) => {
        console.warn('Real-time tasks onSnapshot error:', error);
        if (code === DEFAULT_CLASS_CODE) {
          onTasksUpdated(fallbackTasks);
        } else {
          onTasksUpdated([]);
        }
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to attach tasks snapshot listener:', err);
    if (code === DEFAULT_CLASS_CODE) {
      onTasksUpdated(fallbackTasks);
    } else {
      onTasksUpdated([]);
    }
    return () => {};
  }
}

/**
 * Subscribe in real-time to schedules in a specific class
 */
export function subscribeToClassSchedules(
  classCode: string,
  onSchedulesUpdated: (schedules: CourseSchedule[]) => void,
  fallbackSchedules: CourseSchedule[]
): () => void {
  const code = classCode.trim().toUpperCase() || DEFAULT_CLASS_CODE;

  try {
    const schedCollectionRef = collection(db, 'classes', code, 'schedules');
    const unsubscribe = onSnapshot(
      schedCollectionRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: CourseSchedule[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as CourseSchedule);
          });
          onSchedulesUpdated(list);
        } else {
          // Only seed initial sample data for the default demo class PTI-2024A
          if (code === DEFAULT_CLASS_CODE) {
            seedDefaultClassSchedules(code, fallbackSchedules);
            onSchedulesUpdated(fallbackSchedules);
          } else {
            // Newly created classes start completely empty
            onSchedulesUpdated([]);
          }
        }
      },
      (error) => {
        console.warn('Real-time schedules onSnapshot error:', error);
        if (code === DEFAULT_CLASS_CODE) {
          onSchedulesUpdated(fallbackSchedules);
        } else {
          onSchedulesUpdated([]);
        }
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to attach schedules snapshot listener:', err);
    if (code === DEFAULT_CLASS_CODE) {
      onSchedulesUpdated(fallbackSchedules);
    } else {
      onSchedulesUpdated([]);
    }
    return () => {};
  }
}

/**
 * Seed default tasks into Firestore class subcollection
 */
async function seedDefaultClassTasks(classCode: string, tasks: TaskItem[]) {
  try {
    for (const t of tasks) {
      const docRef = doc(db, 'classes', classCode, 'tasks', t.id);
      await setDoc(docRef, t, { merge: true });
    }
  } catch (e) {
    // ignore offline seed error
  }
}

/**
 * Seed default schedules into Firestore class subcollection
 */
async function seedDefaultClassSchedules(classCode: string, schedules: CourseSchedule[]) {
  try {
    for (const s of schedules) {
      const docRef = doc(db, 'classes', classCode, 'schedules', s.id);
      await setDoc(docRef, s, { merge: true });
    }
  } catch (e) {
    // ignore offline seed error
  }
}

/**
 * Add / Edit / Delete task operations on Firestore
 */
export async function syncAddTask(classCode: string, task: TaskItem) {
  const code = classCode.trim().toUpperCase() || DEFAULT_CLASS_CODE;
  try {
    const docRef = doc(db, 'classes', code, 'tasks', task.id);
    await setDoc(docRef, task);
  } catch (e) {
    console.warn('Firestore addTask sync error:', e);
  }
}

export async function syncUpdateTask(classCode: string, task: TaskItem) {
  const code = classCode.trim().toUpperCase() || DEFAULT_CLASS_CODE;
  try {
    const docRef = doc(db, 'classes', code, 'tasks', task.id);
    await setDoc(docRef, task, { merge: true });
  } catch (e) {
    console.warn('Firestore updateTask sync error:', e);
  }
}

export async function syncDeleteTask(classCode: string, taskId: string) {
  const code = classCode.trim().toUpperCase() || DEFAULT_CLASS_CODE;
  try {
    const docRef = doc(db, 'classes', code, 'tasks', taskId);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('Firestore deleteTask sync error:', e);
  }
}

export async function syncToggleTask(classCode: string, taskId: string, isCompleted: boolean) {
  const code = classCode.trim().toUpperCase() || DEFAULT_CLASS_CODE;
  try {
    const docRef = doc(db, 'classes', code, 'tasks', taskId);
    await updateDoc(docRef, { isCompleted });
  } catch (e) {
    console.warn('Firestore toggleTask sync error:', e);
  }
}

export async function syncAddSchedule(classCode: string, schedule: CourseSchedule) {
  const code = classCode.trim().toUpperCase() || DEFAULT_CLASS_CODE;
  try {
    const docRef = doc(db, 'classes', code, 'schedules', schedule.id);
    await setDoc(docRef, schedule);
  } catch (e) {
    console.warn('Firestore addSchedule sync error:', e);
  }
}

export async function syncDeleteSchedule(classCode: string, scheduleId: string) {
  const code = classCode.trim().toUpperCase() || DEFAULT_CLASS_CODE;
  try {
    const docRef = doc(db, 'classes', code, 'schedules', scheduleId);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('Firestore deleteSchedule sync error:', e);
  }
}

export const DEFAULT_CLASS_MEMBERS: ClassMember[] = [
  {
    nim: '04102425006',
    name: 'Ismail K. Zakaria',
    role: 'KETUA_KELAS',
    prodi: 'Pendidikan Teknologi Informasi',
    joinedAt: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    nim: '04102425015',
    name: 'Rizky Pratama',
    role: 'MAHASISWA',
    prodi: 'Pendidikan Teknologi Informasi',
    joinedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    nim: '04102425022',
    name: 'Siti Nurhaliza',
    role: 'MAHASISWA',
    prodi: 'Pendidikan Teknologi Informasi',
    joinedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

/**
 * Record a student joining a class into Firestore / local cache
 */
export async function recordClassMember(classCode: string, member: ClassMember) {
  const code = classCode.trim().toUpperCase() || DEFAULT_CLASS_CODE;
  try {
    const memberRef = doc(db, 'classes', code, 'members', member.nim);
    await setDoc(memberRef, {
      ...member,
      lastActive: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    console.warn('Firestore recordClassMember offline error:', e);
  }

  // Also cache in localStorage for instant access
  try {
    const key = `siakad_members_${code}`;
    const saved = localStorage.getItem(key);
    const list: ClassMember[] = saved ? JSON.parse(saved) : (code === DEFAULT_CLASS_CODE ? [...DEFAULT_CLASS_MEMBERS] : []);
    const existingIndex = list.findIndex((m) => m.nim === member.nim);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...member };
    } else {
      list.push(member);
    }
    localStorage.setItem(key, JSON.stringify(list));
  } catch (err) {
    console.error('Local member cache error:', err);
  }
}

/**
 * Remove a student from class (Ketua Kelas action)
 */
export async function removeClassMember(classCode: string, memberNim: string) {
  const code = classCode.trim().toUpperCase() || DEFAULT_CLASS_CODE;
  try {
    const memberRef = doc(db, 'classes', code, 'members', memberNim);
    await deleteDoc(memberRef);
  } catch (e) {
    console.warn('Firestore removeClassMember error:', e);
  }

  try {
    const key = `siakad_members_${code}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const list: ClassMember[] = JSON.parse(saved);
      const filtered = list.filter((m) => m.nim !== memberNim);
      localStorage.setItem(key, JSON.stringify(filtered));
    }
  } catch (err) {}
}

/**
 * Subscribe in real-time to the roster of students in a class
 */
export function subscribeToClassMembers(
  classCode: string,
  onMembersUpdated: (members: ClassMember[]) => void
): () => void {
  const code = classCode.trim().toUpperCase() || DEFAULT_CLASS_CODE;

  // Local fallback
  const getLocalMembers = (): ClassMember[] => {
    try {
      const key = `siakad_members_${code}`;
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return code === DEFAULT_CLASS_CODE ? DEFAULT_CLASS_MEMBERS : [];
  };

  try {
    const membersCollRef = collection(db, 'classes', code, 'members');
    const unsubscribe = onSnapshot(
      membersCollRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const membersList: ClassMember[] = [];
          snapshot.forEach((d) => {
            membersList.push(d.data() as ClassMember);
          });
          onMembersUpdated(membersList);
        } else {
          // If empty and default demo class, seed default members
          if (code === DEFAULT_CLASS_CODE) {
            DEFAULT_CLASS_MEMBERS.forEach((m) => recordClassMember(code, m));
            onMembersUpdated(DEFAULT_CLASS_MEMBERS);
          } else {
            onMembersUpdated(getLocalMembers());
          }
        }
      },
      (error) => {
        console.warn('Real-time class members onSnapshot fallback to local:', error);
        onMembersUpdated(getLocalMembers());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to attach class members listener:', err);
    onMembersUpdated(getLocalMembers());
    return () => {};
  }
}
