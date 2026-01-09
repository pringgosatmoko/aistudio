
import React, { useState } from 'react';
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
      </div>
    </div>
  );
};

export default Register;
