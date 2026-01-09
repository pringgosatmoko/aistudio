
import { createClient } from '@supabase/supabase-js';
import { User, UserStatus, GenerationRecord } from '../types';

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const dbService = {
  checkConnection: async (): Promise<{ok: boolean, msg: string}> => {
    if (!supabase) return { ok: false, msg: "Konfigurasi Supabase (URL/Key) kosong di Vercel." };
    try {
      const { error } = await supabase.from('users').select('id').limit(1);
      if (error) {
        if (error.message.includes("relation \"public.users\" does not exist")) {
          return { ok: false, msg: "Tabel 'users' belum dibuat. Silakan jalankan SQL di Supabase." };
        }
        return { ok: false, msg: error.message };
      }
      return { ok: true, msg: "Koneksi Stabil" };
    } catch (e: any) {
      return { ok: false, msg: e.message || "Gagal menghubungi server database." };
    }
  },

  login: async (phone: string, password_hash: string): Promise<User | null> => {
    const masterAdminPhone = process.env.ADMIN_PHONE || "085147007574";
    const masterAdminPass = process.env.ADMIN_PASSWORD || "admin7362";

    if (phone === masterAdminPhone && password_hash === masterAdminPass) {
      return {
        id: 0, 
        name: 'SATMOKO MASTER',
        phone,
        password_hash: '',
        status: UserStatus.APPROVED,
        role: 'admin',
        created_at: new Date().toISOString(),
        expired_at: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000).toISOString()
      };
    }

    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .eq('password_hash', password_hash)
        .single();

      if (error) return null;
      return { ...data, role: data.phone === masterAdminPhone ? 'admin' : 'user' } as User;
    } catch (e) {
      return null;
    }
  },

  register: async (name: string, phone: string, password_hash: string, planDays: number): Promise<{user: User | null, error?: string, rawError?: any}> => {
    if (!supabase) {
      return { user: null, error: "KONFIGURASI_DB_KOSONG" };
    }

    const expired_at = new Date(Date.now() + planDays * 24 * 60 * 60 * 1000).toISOString();
    
    try {
      const { data: existing, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('phone', phone)
        .maybeSingle();

      if (checkError) {
        return { user: null, error: "ERROR_CEK_DATABASE", rawError: checkError };
      }

      if (existing) {
        return { user: null, error: "NOMOR_SUDAH_ADA" };
      }

      const { data, error: insertError } = await supabase
        .from('users')
        .insert([{ name, phone, password_hash, status: UserStatus.PENDING, expired_at }])
        .select()
        .single();

      if (insertError) {
        return { user: null, error: "DATABASE_MENOLAK_DATA", rawError: insertError };
      }

      return { user: { ...data, role: 'user' } as User };
    } catch (e: any) {
      return { user: null, error: "SYSTEM_EXCEPTION", rawError: e };
    }
  },

  getUsers: async (): Promise<User[]> => {
    if (!supabase) return [];
    try {
      const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      return (data?.map(u => ({ ...u, role: u.phone === process.env.ADMIN_PHONE ? 'admin' : 'user' })) as User[]) || [];
    } catch (e) { return []; }
  },

  updateUserStatus: async (userId: string | number, status: UserStatus, daysToAdd: number): Promise<void> => {
    if (!supabase || userId === 0) return;
    try {
      const { data: user } = await supabase.from('users').select('expired_at').eq('id', userId).single();
      let newExpiry = new Date().toISOString();
      if (user) {
        const currentExpiry = user.expired_at ? new Date(user.expired_at).getTime() : Date.now();
        newExpiry = new Date(Math.max(currentExpiry, Date.now()) + daysToAdd * 24 * 60 * 60 * 1000).toISOString();
      }
      await supabase.from('users').update({ status, expired_at: newExpiry }).eq('id', userId);
    } catch (e) {}
  },

  deleteUser: async (userId: string | number): Promise<void> => {
    if (!supabase || userId === 0) return;
    try {
      await supabase.from('users').delete().eq('id', userId);
    } catch (e) {}
  },

  saveRecord: async (record: any): Promise<void> => {
    if (!supabase) return;
    try {
      const userIdToSave = record.userId === 0 ? null : record.userId;
      
      await supabase.from('generations').insert([{
        user_id: userIdToSave,
        type: record.type,
        prompt: record.prompt,
        result_url: record.resultUrl,
        params: record.params,
        created_at: new Date().toISOString()
      }]);
    } catch (e) {
      console.error("Save Record Error:", e);
    }
  },

  getRecords: async (userId: string | number): Promise<GenerationRecord[]> => {
    if (!supabase) return [];
    try {
      const query = supabase
        .from('generations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (userId !== 0) {
        query.eq('user_id', userId);
      }
      
      const { data } = await query;
      return (data as GenerationRecord[]) || [];
    } catch (e) { return []; }
  },

  getRemainingDays: (expiryDate?: string): number => {
    if (!expiryDate) return 0;
    const diff = new Date(expiryDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
};
