
<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { AppRoute, User, UserStatus } from '../types';
import { Icons } from '../constants';
import { dbService } from '../services/supabaseService';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeRoute, onNavigate, user, onLogout }) => {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user?.role === 'admin') {
      const updatePending = async () => {
        const users = await dbService.getUsers();
        const pending = users.filter(u => u.status === UserStatus.PENDING).length;
        setPendingCount(pending);
      };
      updatePending();
      const interval = setInterval(updatePending, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  if (!user) return <div className="bg-slate-950 min-h-screen text-slate-100">{children}</div>;

  const menuItems = [
    { id: AppRoute.DASHBOARD, label: 'Beranda', icon: Icons.Home },
    { id: AppRoute.IMAGE_TO_VIDEO, label: 'Gambar → Video', icon: Icons.Video },
    { id: AppRoute.TEXT_TO_IMAGE, label: 'Teks → Gambar', icon: Icons.Image },
    { id: AppRoute.HISTORY, label: 'Riwayat', icon: Icons.History },
    { id: AppRoute.PROFILE, label: 'Profil Saya', icon: Icons.User },
  ];

  if (user.role === 'admin') {
    menuItems.push({ id: AppRoute.ADMIN, label: 'Panel Admin', icon: Icons.Shield });
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-200 font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-slate-900/60 border-r border-slate-800 h-screen sticky top-0 p-8 backdrop-blur-2xl">
        <div className="mb-12">
          <Logo size="md" />
        </div>

        <nav className="flex-1 space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all group ${
                activeRoute === item.id 
                  ? 'bg-amber-500 text-slate-950 shadow-[0_15px_35px_rgba(245,158,11,0.2)]' 
                  : 'text-slate-500 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon />
                {item.label}
              </div>
              {item.id === AppRoute.ADMIN && pendingCount > 0 && (
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black ${activeRoute === AppRoute.ADMIN ? 'bg-slate-950 text-amber-500' : 'bg-amber-500 text-slate-950 animate-bounce'}`}>
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <Icons.Logout />
            Keluar Akun
=======
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, UserStatus } from '../types';
import Countdown from './Countdown';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/text-to-image', label: 'Text to Image', icon: '🎨' },
    { path: '/image-to-video', label: 'Image to Video', icon: '🎬' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  if (profile?.role === UserRole.ADMIN) {
    menuItems.push({ path: '/admin', label: 'Admin Panel', icon: '🛠️' });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 glass-card border-r border-white/5 flex flex-col sticky top-0 h-auto md:h-screen z-50">
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            SATMOKO AI
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Creative Studio</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          {profile && (
            <div className="mb-4">
              <Countdown expiryDate={profile.expired_at} />
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-all"
          >
            <span>🚪</span>
            <span>Logout</span>
>>>>>>> b52a159 (Initial commit SATMOKO Creative Studio AI)
          </button>
        </div>
      </aside>

      {/* Main Content */}
<<<<<<< HEAD
      <main className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-5 bg-slate-900 border-b border-slate-800 sticky top-0 z-20 backdrop-blur-lg bg-opacity-90">
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={false} />
            <div>
              <h1 className="text-sm font-black text-white tracking-widest italic">SATMOKO</h1>
              <p className="text-[7px] text-amber-500 font-bold tracking-[0.2em] uppercase">Creative AI</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             {user.role === 'admin' && pendingCount > 0 && (
               <button onClick={() => onNavigate(AppRoute.ADMIN)} className="w-8 h-8 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-[10px] font-black animate-pulse shadow-lg shadow-amber-500/30">
                 {pendingCount}
               </button>
             )}
             <button onClick={onLogout} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"><Icons.Logout /></button>
          </div>
        </header>

        <div className="p-6 md:p-12 max-w-7xl mx-auto w-full">
          {activeRoute !== AppRoute.DASHBOARD && activeRoute !== AppRoute.LOGIN && (
            <button 
              onClick={() => onNavigate(AppRoute.DASHBOARD)}
              className="mb-10 flex items-center gap-3 text-[10px] font-black text-slate-500 hover:text-amber-500 transition-colors group uppercase tracking-[0.3em]"
            >
              <span className="group-hover:-translate-x-1.5 transition-transform">
                <Icons.Back />
              </span>
              Beranda Studio
            </button>
          )}
          {children}
        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-800 flex justify-around p-4 z-20 backdrop-blur-xl">
          {menuItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                activeRoute === item.id ? 'text-amber-500 scale-110' : 'text-slate-500 opacity-60'
              }`}
            >
              <item.icon />
              <span className="text-[8px] font-black uppercase tracking-widest">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </nav>
=======
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
>>>>>>> b52a159 (Initial commit SATMOKO Creative Studio AI)
      </main>
    </div>
  );
};

export default Layout;
