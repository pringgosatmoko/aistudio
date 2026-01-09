
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
  );
};

export default App;
