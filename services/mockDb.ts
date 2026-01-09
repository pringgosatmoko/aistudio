
import { User, UserStatus, GenerationRecord } from '../types';

const USERS_KEY = 'ai_studio_users';
const RECORDS_KEY = 'ai_studio_records';
const CURRENT_USER_KEY = 'ai_studio_session';

const init = () => {
  if (typeof window === 'undefined') return;
  
  const usersStr = localStorage.getItem(USERS_KEY);
  let users: User[] = usersStr ? JSON.parse(usersStr) : [];
  
  // Mengambil kredensial admin dari Environment Variables (Vercel)
  // Fallback ke kredensial lama jika env belum diset
  const adminPhone = (process.env as any).ADMIN_PHONE || "085147007574";
  const adminPassword = (process.env as any).ADMIN_PASSWORD || "admin7362";
  
  const existingAdminIdx = users.findIndex(u => u.role === 'admin');
  
  if (existingAdminIdx === -1) {
    const defaultAdmin: User = {
      id: 'admin-master',
      name: 'SATMOKO MASTER',
      phone: adminPhone,
      password_hash: adminPassword, 
      status: UserStatus.APPROVED,
      role: 'admin',
      created_at: new Date().toISOString(),
      expired_at: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000).toISOString()
    };
    users.push(defaultAdmin);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } else {
    // Selalu update kredensial admin di local storage jika env berubah
    users[existingAdminIdx].phone = adminPhone;
    users[existingAdminIdx].password_hash = adminPassword;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

init();

export const db = {
  getUsers: (): User[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  },
  saveUsers: (users: User[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  
  getRecords: (): GenerationRecord[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]');
  },
  saveRecord: (record: GenerationRecord) => {
    if (typeof window === 'undefined') return;
    const records = db.getRecords();
    records.unshift(record);
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },
  setCurrentUser: (user: User | null) => {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  register: (name: string, phone: string, password_hash: string, planDays: number = 30): User | null => {
    const users = db.getUsers();
    if (users.find(u => u.phone === phone)) return null;

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      phone,
      password_hash,
      status: UserStatus.PENDING,
      role: 'user',
      created_at: new Date().toISOString(),
      expired_at: new Date(Date.now() + planDays * 24 * 60 * 60 * 1000).toISOString()
    };
    db.saveUsers([...users, newUser]);
    return newUser;
  },

  login: (phone: string, password_hash: string): User | null => {
    const users = db.getUsers();
    const user = users.find(u => u.phone === phone && u.password_hash === password_hash);
    if (user) {
      db.setCurrentUser(user);
    }
    return user || null;
  },

  updateUserStatus: (userId: string, status: UserStatus, daysToAdd?: number): User | null => {
    const users = db.getUsers();
    const userIdx = users.findIndex(u => u.id === userId);
    if (userIdx === -1) return null;

    let expiredAt = users[userIdx].expired_at;
    
    if (status === UserStatus.APPROVED) {
      const now = Date.now();
      const currentExpiry = expiredAt ? new Date(expiredAt).getTime() : now;
      const baseDate = Math.max(currentExpiry, now);
      const days = daysToAdd || 30;
      expiredAt = new Date(baseDate + days * 24 * 60 * 60 * 1000).toISOString();
    }
    
    users[userIdx] = { ...users[userIdx], status, expired_at: expiredAt };
    db.saveUsers(users);
    return users[userIdx];
  },

  deleteUser: (userId: string) => {
    const users = db.getUsers().filter(u => u.id !== userId);
    db.saveUsers(users);
  },

  getRemainingDays: (expiryDate?: string): number => {
    if (!expiryDate) return 0;
    const diff = new Date(expiryDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
};
