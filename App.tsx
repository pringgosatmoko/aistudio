
<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { AppRoute, User } from './types';
import { dbService } from './services/supabaseService';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ImageToVideo from './pages/ImageToVideo';
import TextToImage from './pages/TextToImage';
import History from './pages/History';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';

const App: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState<AppRoute>(AppRoute.LOGIN);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('satmoko_session');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setActiveRoute(AppRoute.DASHBOARD);
    }
    setIsInitializing(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('satmoko_session', JSON.stringify(user));
    setActiveRoute(AppRoute.DASHBOARD);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('satmoko_session');
    setActiveRoute(AppRoute.LOGIN);
  };

  if (isInitializing) return null;

  const renderPage = () => {
    if (!currentUser) {
      if (activeRoute === AppRoute.REGISTER) return <Register onNavigate={setActiveRoute} />;
      return <Login onNavigate={setActiveRoute} onLogin={handleLogin} />;
    }

    switch (activeRoute) {
      case AppRoute.DASHBOARD: return <Dashboard user={currentUser} onNavigate={setActiveRoute} />;
      case AppRoute.IMAGE_TO_VIDEO: return <ImageToVideo user={currentUser} />;
      case AppRoute.TEXT_TO_IMAGE: return <TextToImage user={currentUser} />;
      case AppRoute.HISTORY: return <History user={currentUser} />;
      case AppRoute.PROFILE: return <Profile user={currentUser} onNavigate={setActiveRoute} />;
      case AppRoute.ADMIN: return currentUser.role === 'admin' ? <Admin /> : <Dashboard user={currentUser} onNavigate={setActiveRoute} />;
      default: return <Dashboard user={currentUser} onNavigate={setActiveRoute} />;
    }
  };

  return (
    <Layout 
      activeRoute={activeRoute} 
      onNavigate={setActiveRoute} 
      user={currentUser} 
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
=======
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TextToImage from './pages/TextToImage';
import ImageToVideo from './pages/ImageToVideo';
import ProfilePage from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Layout from './components/Layout';
import { UserRole, UserStatus } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">Loading...</div>;
  if (!profile) return <Navigate to="/login" />;
  
  if (profile.status === UserStatus.PENDING) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center text-3xl mb-4">⏳</div>
        <h2 className="text-2xl font-bold mb-2">Akun Menunggu Persetujuan</h2>
        <p className="text-gray-400 max-w-md">Pendaftaran Anda sedang diproses oleh tim kami. Silakan hubungi admin di WhatsApp atau Telegram untuk mempercepat proses aktivasi.</p>
        <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all">Segarkan Halaman</button>
      </div>
    );
  }

  return <Layout>{children}</Layout>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">Loading...</div>;
  if (!profile || profile.role !== UserRole.ADMIN) return <Navigate to="/dashboard" />;

  return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/text-to-image" element={<ProtectedRoute><TextToImage /></ProtectedRoute>} />
          <Route path="/image-to-video" element={<ProtectedRoute><ImageToVideo /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
>>>>>>> b52a159 (Initial commit SATMOKO Creative Studio AI)
  );
};

export default App;
