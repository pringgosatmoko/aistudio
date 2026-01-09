
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
    }
  };

  return (
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
      </div>
    </div>
  );
};

export default Login;
