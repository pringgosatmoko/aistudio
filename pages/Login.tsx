
<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { AppRoute, User } from '../types';
import { dbService } from '../services/supabaseService';
import Logo from '../components/Logo';

interface LoginProps {
  onNavigate: (route: AppRoute) => void;
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate, onLogin }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ok: boolean, msg: string}>({ ok: true, msg: "Mengecek Database..." });

  useEffect(() => {
    const check = async () => {
      const status = await dbService.checkConnection();
      setDbStatus(status);
    };
    check();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await dbService.login(phone, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Nomor HP atau Kata Sandi salah.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
=======
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const email = `${phone}@user.satmoko.ai`;
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login gagal. Periksa nomor HP dan password.');
    } finally {
      setLoading(false);
>>>>>>> b52a159 (Initial commit SATMOKO Creative Studio AI)
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      <div className="w-full max-w-md space-y-10 bg-slate-900/80 p-10 rounded-[3.5rem] border border-slate-800 shadow-2xl relative backdrop-blur-xl">
        <div className="text-center">
          <Logo size="lg" />
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${dbStatus.ok ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
            <p className={`text-[8px] font-black uppercase tracking-widest ${dbStatus.ok ? 'text-slate-500' : 'text-red-500'}`}>
              {dbStatus.msg}
            </p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <input type="text" required className="w-full p-5 bg-slate-800/50 border border-slate-700 rounded-3xl text-white font-bold" placeholder="Nomor WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input type="password" required className="w-full p-5 bg-slate-800/50 border border-slate-700 rounded-3xl text-white font-bold" placeholder="Kata Sandi" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-red-400 text-[10px] text-center font-black uppercase tracking-widest">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full py-6 bg-amber-500 text-slate-950 rounded-3xl font-black tracking-[0.3em] uppercase">
            {isLoading ? 'MENCARI DATA...' : 'MASUK KE STUDIO'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-slate-500">
            Belum punya akun?{' '}
            <button onClick={() => onNavigate(AppRoute.REGISTER)} className="font-black text-amber-500 uppercase tracking-widest">Daftar</button>
          </p>
        </div>
=======
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            SATMOKO AI
          </h1>
          <p className="text-gray-500 mt-2">Masuk ke Studio Kreatif Anda</p>
        </div>

        <form onSubmit={handleLogin} className="glass-card p-8 rounded-3xl space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Nomor HP</label>
            <input
              type="text"
              required
              placeholder="Contoh: 08123456789"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-8 text-sm">
          Belum punya akun?{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
            Daftar Sekarang
          </Link>
        </p>
>>>>>>> b52a159 (Initial commit SATMOKO Creative Studio AI)
      </div>
    </div>
  );
};

export default Login;
