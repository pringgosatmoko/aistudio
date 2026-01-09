
import React from 'react';
<<<<<<< HEAD
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
=======
import { useAuth } from '../contexts/AuthContext';
import { UserStatus, SubscriptionType } from '../types';

const ProfilePage: React.FC = () => {
  const { profile } = useAuth();

  const getStatusColor = (status: UserStatus) => {
    switch(status) {
      case UserStatus.ACTIVE: return 'text-green-400 bg-green-400/10';
      case UserStatus.PENDING: return 'text-yellow-400 bg-yellow-400/10';
      case UserStatus.EXPIRED: return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getPlanLabel = (type?: SubscriptionType) => {
    switch(type) {
      case SubscriptionType.MONTH1: return '1 Bulan';
      case SubscriptionType.MONTH3: return '3 Bulan';
      case SubscriptionType.YEAR1: return '1 Tahun';
      default: return 'N/A';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold">Profil Akun</h1>
        <p className="text-gray-400">Informasi langganan dan pengaturan Anda.</p>
      </header>

      <div className="space-y-6">
        <div className="glass-card p-8 rounded-3xl space-y-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold border-4 border-white/5 shadow-2xl">
              {profile?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile?.name}</h2>
              <p className="text-gray-500">{profile?.phone}</p>
              <div className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(profile?.status || UserStatus.PENDING)}`}>
                {profile?.status}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] uppercase text-gray-500 font-bold mb-1">Paket Saat Ini</p>
              <p className="text-xl font-bold text-blue-400">{getPlanLabel(profile?.subscription_type)}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] uppercase text-gray-500 font-bold mb-1">Masa Aktif Hingga</p>
              <p className="text-lg font-bold">
                {profile?.expired_at 
                  ? new Date(profile.expired_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                  : 'Belum Diaktifkan'}
>>>>>>> b52a159 (Initial commit SATMOKO Creative Studio AI)
              </p>
            </div>
          </div>

<<<<<<< HEAD
          <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xs font-black text-white tracking-[0.2em] uppercase mb-1">Keamanan Jaringan</h3>
              <p className="text-xs text-slate-500 font-medium">Gunakan kombinasi password yang kuat untuk artist ID Anda.</p>
            </div>
            <button className="px-10 py-4 bg-slate-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest border border-slate-700 hover:bg-slate-700 transition-all active:scale-95 shadow-lg">
              Ubah Password
=======
          <div className="bg-blue-600/10 p-6 rounded-2xl border border-blue-500/20">
            <div className="flex items-start space-x-4">
              <div className="text-2xl">📱</div>
              <div>
                <h4 className="font-bold text-blue-400">Hubungkan Telegram</h4>
                <p className="text-sm text-gray-400 mt-1">Dapatkan notifikasi masa aktif dan hasil generate AI langsung di ponsel Anda.</p>
                <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all">
                  Mulai Bot Telegram
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl">
          <h3 className="text-lg font-bold mb-4">Bantuan & Dukungan</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center justify-between group">
              <span>Hubungi Admin WhatsApp</span>
              <span className="opacity-0 group-hover:opacity-100 transition-all text-blue-400">👉</span>
            </button>
            <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center justify-between group">
              <span>Pertanyaan Umum (FAQ)</span>
              <span className="opacity-0 group-hover:opacity-100 transition-all text-blue-400">👉</span>
>>>>>>> b52a159 (Initial commit SATMOKO Creative Studio AI)
            </button>
          </div>
        </div>
      </div>
<<<<<<< HEAD

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
=======
>>>>>>> b52a159 (Initial commit SATMOKO Creative Studio AI)
    </div>
  );
};

<<<<<<< HEAD
export default Profile;
=======
export default ProfilePage;
>>>>>>> b52a159 (Initial commit SATMOKO Creative Studio AI)
