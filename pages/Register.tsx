
import React, { useState } from 'react';
<<<<<<< HEAD
import { AppRoute } from '../types';
import { dbService } from '../services/supabaseService';
import { notificationService } from '../services/notificationService';
import Logo from '../components/Logo';

interface RegisterProps {
  onNavigate: (route: AppRoute) => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(30);
  const [success, setSuccess] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{msg: string, detail?: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorInfo(null);

    try {
      const result = await dbService.register(name, phone, password, selectedPlan);
      
      if (result.user) {
        const telegramMsg = `🚀 <b>MEMBER BARU!</b>\n👤 Name: ${name}\n📱 WA: ${phone}\n📅 Plan: ${selectedPlan} Days`;
        await notificationService.sendTelegramAlert(telegramMsg);
        setSuccess(true);
      } else {
        let msg = "Terjadi Kesalahan.";
        let detail = result.rawError?.message || JSON.stringify(result.rawError);

        if (result.error === "NOMOR_SUDAH_ADA") msg = "NOMOR SUDAH TERDAFTAR";
        else if (result.error === "DATABASE_MENOLAK_DATA") msg = "DATABASE MENOLAK PENDAFTARAN";
        else if (result.error === "ERROR_CEK_DATABASE") msg = "GAGAL CEK DATABASE";

        setErrorInfo({ msg, detail });
      }
    } catch (err: any) {
      setErrorInfo({ msg: "KONEKSI BERMASALAH", detail: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <div className="w-full max-w-md space-y-8 bg-slate-900 p-14 rounded-[3.5rem] border border-slate-800 text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
            <svg fill="currentColor" viewBox="0 0 20 20" className="w-10 h-10"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          </div>
          <h2 className="text-2xl font-black text-white">Pendaftaran Sukses</h2>
          <p className="text-slate-400 text-sm">Akun akan aktif setelah disetujui admin.</p>
          <button onClick={() => onNavigate(AppRoute.LOGIN)} className="w-full py-6 bg-amber-500 text-slate-950 rounded-3xl font-black uppercase tracking-widest mt-6">KEMBALI KE LOGIN</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      <div className="w-full max-w-lg space-y-10 bg-slate-900/90 p-10 rounded-[3.5rem] border border-slate-800 shadow-2xl relative backdrop-blur-xl">
        <div className="text-center">
          <Logo size="md" />
          <h1 className="text-xl font-black text-white tracking-[0.2em] uppercase mt-4">DAFTAR ARTIST</h1>
        </div>

        <form className="space-y-6" onSubmit={handleRegister}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" required className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white font-bold" placeholder="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" required className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white font-bold" placeholder="WhatsApp (08xx)" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[30, 90, 365].map((days) => (
              <button key={days} type="button" onClick={() => setSelectedPlan(days)} className={`py-3 rounded-xl border text-[9px] font-black transition-all ${selectedPlan === days ? 'bg-amber-500 border-amber-500 text-slate-950' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                {days === 365 ? '1 TAHUN' : `${days/30} BULAN`}
              </button>
            ))}
          </div>

          <input type="password" required className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white font-bold" placeholder="Kata Sandi" value={password} onChange={(e) => setPassword(e.target.value)} />

          {errorInfo && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl space-y-2">
              <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">{errorInfo.msg}</p>
              {errorInfo.detail && (
                <div className="bg-slate-950 p-2 rounded-lg">
                  <p className="text-[8px] font-mono text-slate-500 break-all">DEBUG_LOG: {errorInfo.detail}</p>
                </div>
              )}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-amber-500 text-slate-950 rounded-3xl font-black tracking-[0.2em] shadow-xl disabled:opacity-50">
            {isSubmitting ? 'MENDAFTARKAN...' : 'DAFTAR SEKARANG'}
          </button>
        </form>

        <div className="text-center">
          <button onClick={() => onNavigate(AppRoute.LOGIN)} className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest">Sudah punya akun? Masuk</button>
        </div>
=======
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SubscriptionType, UserRole, UserStatus } from '../types';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [subType, setSubType] = useState<SubscriptionType>(SubscriptionType.MONTH1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Internal email generation logic
      const email = `${phone}@user.satmoko.ai`;
      
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Registrasi gagal.');

      // Map SubscriptionType to days
      let days = 30;
      if (subType === SubscriptionType.MONTH3) days = 90;
      if (subType === SubscriptionType.YEAR1) days = 365;

      // Insert into profiles table with correct columns
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        name,
        phone,
        subscription_type: subType,
        subscription_days: days,
        status: UserStatus.PENDING,
        role: UserRole.USER,
        expired_at: null,
      });

      if (profileError) throw profileError;

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registrasi gagal. Nomor HP mungkin sudah terdaftar.');
    } finally {
      setLoading(false);
    }
  };

  const planOptions = [
    { id: SubscriptionType.MONTH1, label: '1 Bulan' },
    { id: SubscriptionType.MONTH3, label: '3 Bulan' },
    { id: SubscriptionType.YEAR1, label: '1 Tahun' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            BUAT AKUN
          </h1>
          <p className="text-gray-500 mt-2">Gabung dengan SATMOKO Creative Studio</p>
        </div>

        <form onSubmit={handleRegister} className="glass-card p-8 rounded-3xl space-y-4">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nomor HP</label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Pilih Paket Langganan</label>
            <div className="grid grid-cols-3 gap-2">
              {planOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSubType(opt.id)}
                  className={`py-2 text-xs rounded-lg border transition-all ${
                    subType === opt.id
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 mt-4 rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-8 text-sm">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Login
          </Link>
        </p>
>>>>>>> b52a159 (Initial commit SATMOKO Creative Studio AI)
      </div>
    </div>
  );
};

export default Register;
