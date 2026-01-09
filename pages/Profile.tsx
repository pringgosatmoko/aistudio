
import React from 'react';
import { User, AppRoute } from '../types';
import { dbService } from '../services/supabaseService';

interface ProfileProps {
  user: User;
  onNavigate: (route: AppRoute) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onNavigate }) => {
  const remainingDays = dbService.getRemainingDays(user.expired_at);
  const statusLabel = user.status === 'approved' ? 'Aktif' : user.status === 'pending' ? 'Pending' : 'Ditolak';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-slate-900/60 rounded-[3rem] border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="bg-slate-800/50 p-12 text-white relative">
          <div className="absolute top-0 right-0 p-12 opacity-5">
             <svg width="150" height="150" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10 text-center md:text-left">
            <div className="w-32 h-32 bg-slate-950 rounded-[2.5rem] flex items-center justify-center text-5xl font-black border border-slate-700 shadow-2xl text-amber-500">
              {user.name[0].toUpperCase()}
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight">{user.name}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                 <span className="px-4 py-1.5 bg-amber-500 text-slate-950 text-[11px] font-black rounded-full uppercase tracking-widest">{user.role === 'admin' ? 'Master Admin' : 'Artist Member'}</span>
                 <span className="text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase">Creative Identity</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-12 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-16">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Kontak WhatsApp</label>
              <p className="text-2xl font-black text-white border-b border-slate-800 pb-3">{user.phone}</p>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Status Otorisasi</label>
              <div className="flex items-center gap-4 border-b border-slate-800 pb-3">
                 <span className={`w-4 h-4 rounded-full ${user.status === 'approved' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]'}`} />
                 <p className="text-2xl font-black text-white">{statusLabel}</p>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Tanggal Bergabung</label>
              <p className="text-2xl font-black text-white border-b border-slate-800 pb-3">{new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Sisa Langganan</label>
              <p className={`text-2xl font-black border-b border-slate-800 pb-3 ${remainingDays > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                {user.status === 'approved' ? `${remainingDays} Hari` : 'Belum Aktif'}
              </p>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xs font-black text-white tracking-[0.2em] uppercase mb-1">Keamanan Jaringan</h3>
              <p className="text-xs text-slate-500 font-medium">Gunakan kombinasi password yang kuat untuk artist ID Anda.</p>
            </div>
            <button className="px-10 py-4 bg-slate-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest border border-slate-700 hover:bg-slate-700 transition-all active:scale-95 shadow-lg">
              Ubah Password
            </button>
          </div>
        </div>
      </div>

      {/* Admin Panel Direct Link Section */}
      {user.role === 'admin' && (
        <div className="bg-amber-500 p-10 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-amber-400 transition-all cursor-pointer" onClick={() => onNavigate(AppRoute.ADMIN)}>
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-slate-950 text-amber-500 rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Akses Panel Member</h3>
              <p className="text-slate-800 font-bold text-sm">Klik di sini untuk menyetujui member yang baru saja mendaftar.</p>
            </div>
          </div>
          <div className="bg-slate-950 text-amber-500 px-10 py-5 rounded-2xl font-black text-[11px] tracking-widest uppercase shadow-xl group-hover:scale-105 transition-all">
            LIHAT SEMUA MEMBER
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
