
<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { AppRoute, User, UserStatus } from '../types';
import { Icons } from '../constants';
import { dbService } from '../services/supabaseService';

interface DashboardProps {
  user: User;
  onNavigate: (route: AppRoute) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [pendingCount, setPendingCount] = useState(0);
  const remainingDays = dbService.getRemainingDays(user.expired_at);
  const statusLabel = user.status === 'approved' ? 'Aktif' : user.status === 'pending' ? 'Menunggu Review' : 'Ditolak';
  
  useEffect(() => {
    if (user.role === 'admin') {
      const fetchCounts = async () => {
        const users = await dbService.getUsers();
        setPendingCount(users.filter(u => u.status === UserStatus.PENDING).length);
      };
      fetchCounts();
    }
  }, [user]);

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-slate-900/50 p-10 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden relative group">
        <div className="relative z-10">
          <span className="inline-block py-1 px-4 bg-amber-500/10 text-amber-500 rounded-full text-[9px] font-black tracking-[0.2em] uppercase mb-6 border border-amber-500/20">Studio Kreatif AI</span>
          <h2 className="text-4xl font-black mb-4 text-white tracking-tight">Halo, {user.name.split(' ')[0]}!</h2>
          <p className="text-slate-400 max-w-lg leading-relaxed font-medium">Gunakan kekuatan AI tercanggih kami untuk mengubah imajinasi Anda menjadi visual sinematik berkualitas tinggi.</p>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] group-hover:bg-amber-500/20 transition-all duration-1000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/20 transition-all duration-1000"></div>
      </div>

      {/* Admin Quick Link */}
      {user.role === 'admin' && (
        <button 
          onClick={() => onNavigate(AppRoute.ADMIN)}
          className="w-full group bg-gradient-to-r from-amber-600/20 to-amber-500/5 p-1 p-8 rounded-[2.5rem] border border-amber-500/30 hover:border-amber-500 transition-all text-left relative overflow-hidden shadow-2xl"
        >
          <div className="flex items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Icons.Shield />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Manajemen Member Artist</h3>
                <p className="text-sm text-slate-400 mt-1">Ada <span className="text-amber-500 font-bold">{pendingCount} pendaftaran baru</span> yang butuh persetujuan Anda.</p>
              </div>
            </div>
            <div className="hidden md:flex px-8 py-4 bg-amber-500 text-slate-950 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-xl group-hover:bg-amber-400">
              BUKA DAFTAR MEMBER
            </div>
          </div>
          <div className="absolute top-0 right-0 h-full w-1/3 bg-amber-500/5 skew-x-12 translate-x-10"></div>
        </button>
      )}

      {/* Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <button 
          onClick={() => onNavigate(AppRoute.IMAGE_TO_VIDEO)}
          className="group bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800 hover:border-amber-500/50 hover:shadow-[0_0_50px_rgba(245,158,11,0.05)] transition-all text-left relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-slate-800 text-amber-500 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-500 border border-slate-700 group-hover:border-amber-500 shadow-xl">
            <Icons.Video />
          </div>
          <h3 className="text-2xl font-black mb-2 text-white group-hover:text-amber-500 transition-colors">Animasi Kanvas</h3>
          <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors leading-relaxed">Ubah gambar statis menjadi video sinematik 3-8 detik menggunakan teknologi VEO Engine.</p>
        </button>

        <button 
          onClick={() => onNavigate(AppRoute.TEXT_TO_IMAGE)}
          className="group bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800 hover:border-blue-500/50 hover:shadow-[0_0_50px_rgba(59,130,246,0.05)] transition-all text-left relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-slate-800 text-blue-400 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 border border-slate-700 group-hover:border-blue-500 shadow-xl">
            <Icons.Image />
          </div>
          <h3 className="text-2xl font-black mb-2 text-white group-hover:text-blue-400 transition-colors">Sintesis Visual</h3>
          <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors leading-relaxed">Ciptakan gambar ultra-HD dari teks. Manfaatkan Gemini untuk detail kreatif yang realistis.</p>
        </button>
      </div>

      {/* Subscription Status */}
      <div className="bg-slate-900/60 rounded-[2.5rem] border border-slate-800 p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-6">
            <div className={`w-5 h-5 rounded-full ring-8 ring-opacity-10 ${user.status === 'approved' ? 'bg-green-400 ring-green-400' : 'bg-amber-400 ring-amber-400 animate-pulse'}`}></div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Status Keanggotaan</p>
              <h4 className="text-2xl font-black text-white tracking-wide">{statusLabel}</h4>
            </div>
          </div>
          <div className="flex flex-col items-end">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Masa Berlaku Akses</p>
             <p className={`text-2xl font-black ${remainingDays > 5 ? 'text-white' : remainingDays > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                {user.status === 'approved' ? `${remainingDays} Hari` : 'Akses Pending'}
             </p>
          </div>
        </div>
      </div>
=======
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { UserStatus } from '../types';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();

  const cards = [
    {
      title: 'Text to Image',
      desc: 'Buat gambar estetik dari deskripsi teks sederhana.',
      icon: '🎨',
      link: '/text-to-image',
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Image to Video',
      desc: 'Ubah foto diam menjadi video sinematik pendek.',
      icon: '🎬',
      link: '/image-to-video',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'Profile Settings',
      desc: 'Atur profil dan cek masa aktif langganan.',
      icon: '👤',
      link: '/profile',
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Halo, {profile?.name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-400 mt-1">Selamat datang kembali di SATMOKO Creative Studio AI.</p>
        </div>
        <div className="glass-card px-4 py-2 rounded-2xl flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${profile?.status === UserStatus.ACTIVE ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
          <span className="text-sm font-medium uppercase tracking-wider">{profile?.status} User</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="group glass-card p-6 rounded-3xl hover:border-white/20 transition-all overflow-hidden relative"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-10 blur-2xl group-hover:opacity-20 transition-all`}></div>
            <div className="text-4xl mb-4">{card.icon}</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{card.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
          </Link>
        ))}
      </div>

      <section className="glass-card p-8 rounded-3xl">
        <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
          <span>✨</span>
          <span>Inspirasi Harian</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-white/5 relative group cursor-pointer">
              <img 
                src={`https://picsum.photos/seed/ai${i}/400/400`} 
                alt="AI Generated Sample" 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all scale-110 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-4">
                <span className="text-[10px] font-medium text-white truncate">"Futuristic city in neon lights..."</span>
              </div>
            </div>
          ))}
        </div>
      </section>
>>>>>>> b52a159 (Initial commit SATMOKO Creative Studio AI)
    </div>
  );
};

export default Dashboard;
