
import React, { useState, useEffect } from 'react';
import { VideoParams, User, CharacterParams } from '../types';
import { VIDEO_STYLES, CAMERA_ANGLES, Icons } from '../constants';
import ImageUploader from '../components/ImageUploader';
import { geminiService } from '../services/geminiService';
import { dbService } from '../services/supabaseService';

interface ImageToVideoProps {
  user: User;
}

const ImageToVideo: React.FC<ImageToVideoProps> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(true);
  
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [charParams, setCharParams] = useState<CharacterParams>({ name: '', features: '', outfit: '' });
  const [params, setParams] = useState<VideoParams>({
    duration: '3s',
    aspectRatio: '16:9',
    style: 'Cinematic',
    cameraAngle: 'Eye Level',
    audioOn: true,
    scene: '',
    dialogue: ''
  });

  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const toggleAccordion = (id: string) => setOpenAccordion(openAccordion === id ? null : id);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    if (window.aistudio) {
      const active = await window.aistudio.hasSelectedApiKey();
      setHasKey(active);
    }
  };

  const handleOpenKeyPicker = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true); // Asumsi sukses setelah dialog dibuka
    }
  };

  const handleGenerate = async () => {
    if (!imageB64 || !prompt) {
      setError('Bingkai sumber atau perintah teks belum lengkap.');
      return;
    }

    if (user.status !== 'approved') {
      setError('Akses dibatasi. Langganan Anda perlu diaktifkan oleh admin.');
      return;
    }

    setLoading(true);
    setError(null);
    setResultUrl(null);

    try {
      const videoUrl = await geminiService.generateVideo(imageB64, prompt, { ...params, character: charParams });
      setResultUrl(videoUrl);
      
      const record = {
        userId: user.id,
        type: 'video',
        prompt,
        resultUrl: videoUrl,
        params: { ...params, character: charParams }
      };
      await dbService.saveRecord(record);
    } catch (err: any) {
      if (err.message === "KEY_NOT_FOUND") {
        setHasKey(false);
        setError("Kunci API tidak valid atau belum dipilih. Silakan klik tombol Aktivasi Mesin.");
      } else {
        setError(err.message || 'Gagal menghasilkan video. Server sedang sibuk.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn pb-24">
      {/* Tombol Aktivasi Mesin Wajib untuk Veo */}
      {!hasKey && (
        <div className="lg:col-span-12 mb-4">
          <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 animate-pulse">
                <Icons.Shield />
              </div>
              <div>
                <h4 className="text-white font-black uppercase text-xs tracking-widest">Aktivasi Mesin VEO</h4>
                <p className="text-slate-400 text-[10px] mt-1">Gunakan kunci API berbayar untuk akses video tanpa batas. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-amber-500 underline">Info Billing</a></p>
              </div>
            </div>
            <button 
              onClick={handleOpenKeyPicker}
              className="px-8 py-3 bg-amber-500 text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg"
            >
              PILIH KUNCI API
            </button>
          </div>
        </div>
      )}

      <div className="lg:col-span-5 space-y-4">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-6">
          <ImageUploader onImageSelect={setImageB64} label="Bingkai Sumber Utama" />
          
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Panduan Pergerakan</label>
            <textarea 
              className="w-full p-5 bg-slate-800/50 border border-slate-700 rounded-2xl text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none min-h-[120px] text-white placeholder:text-slate-600 leading-relaxed"
              placeholder="Deskripsikan aksi sinematik yang Anda inginkan..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Durasi Video</label>
              <select className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-amber-500" value={params.duration} onChange={(e) => setParams({...params, duration: e.target.value as any})}>
                <option value="3s">3 Detik (Sinematik)</option>
                <option value="6s">6 Detik (Narasi)</option>
                <option value="8s">8 Detik (Fitur)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Rasio Aspek</label>
              <select className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-amber-500" value={params.aspectRatio} onChange={(e) => setParams({...params, aspectRatio: e.target.value as any})}>
                <option value="16:9">16:9 (Layar Lebar)</option>
                <option value="9:16">9:16 (Vertikal)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            {[
              { id: 'char', title: 'Kontrol Karakter', fields: (
                <div className="p-4 space-y-3 bg-slate-950/30 rounded-2xl border border-slate-800/50 mt-2">
                  <input type="text" placeholder="Nama/Identitas Karakter" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-amber-500" value={charParams.name} onChange={(e) => setCharParams({...charParams, name: e.target.value})} />
                  <input type="text" placeholder="Fitur Visual Karakter" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-amber-500" value={charParams.features} onChange={(e) => setCharParams({...charParams, features: e.target.value})} />
                  <input type="text" placeholder="Gaya Pakaian" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-amber-500" value={charParams.outfit} onChange={(e) => setCharParams({...charParams, outfit: e.target.value})} />
                </div>
              )},
              { id: 'camera', title: 'Lensa & Estetika', fields: (
                <div className="p-4 space-y-3 bg-slate-950/30 rounded-2xl border border-slate-800/50 mt-2">
                   <select className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-amber-500" value={params.style} onChange={(e) => setParams({...params, style: e.target.value})}>
                    {VIDEO_STYLES.map(s => <option key={s} value={s}>Estetika {s}</option>)}
                  </select>
                  <select className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-amber-500" value={params.cameraAngle} onChange={(e) => setParams({...params, cameraAngle: e.target.value})}>
                    {CAMERA_ANGLES.map(a => <option key={a} value={a}>Sudut Kamera {a}</option>)}
                  </select>
                </div>
              )},
              { id: 'narrative', title: 'Latar Dunia', fields: (
                <div className="p-4 space-y-4 bg-slate-950/30 rounded-2xl border border-slate-800/50 mt-2">
                  <textarea placeholder="Atmosfer & lingkungan sekitar..." className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none min-h-[60px] focus:border-amber-500" value={params.scene} onChange={(e) => setParams({...params, scene: e.target.value})} />
                </div>
              )}
            ].map((section) => (
              <div key={section.id} className="group">
                <button onClick={() => toggleAccordion(section.id)} className={`w-full flex justify-between items-center p-4 rounded-2xl transition-all border ${openAccordion === section.id ? 'bg-slate-800 border-slate-700 text-amber-500' : 'bg-slate-900/50 border-transparent text-slate-400 hover:text-white hover:border-slate-800'}`}>
                  <span className="text-xs font-bold uppercase tracking-widest">{section.title}</span>
                  <span className={`transform transition-transform duration-300 ${openAccordion === section.id ? 'rotate-180' : ''}`}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </button>
                {openAccordion === section.id && section.fields}
              </div>
            ))}
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !hasKey}
            className={`w-full py-5 rounded-[1.5rem] font-black tracking-[0.2em] transition-all flex items-center justify-center gap-3 uppercase shadow-xl active:scale-95 ${!hasKey ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-amber-500 text-slate-950 hover:bg-amber-400'}`}
          >
            {loading ? <div className="w-6 h-6 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div> : 'Mulai Sintesis'}
          </button>
          {error && <p className="text-red-400 text-[10px] text-center font-black uppercase tracking-widest mt-2">{error}</p>}
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-slate-800 min-h-[600px] flex flex-col items-center justify-center relative shadow-2xl overflow-hidden group">
          {loading ? (
            <div className="text-center space-y-8 max-w-sm relative z-10">
              <div className="w-24 h-24 border-[6px] border-slate-800 border-t-amber-500 rounded-full animate-spin mx-auto"></div>
              <p className="text-white font-black text-xl tracking-widest uppercase animate-pulse">Memproses Data Sinematik</p>
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Siklus Veo 3.1 Sedang Berjalan</p>
                <p className="text-slate-500 text-[9px] mt-1">Ini biasanya memakan waktu 60-90 detik.</p>
              </div>
            </div>
          ) : resultUrl ? (
            <div className="w-full animate-fadeIn relative z-10 text-center">
              <video src={resultUrl} controls autoPlay loop className="w-full rounded-[2rem] border border-slate-800 shadow-2xl" />
              <a href={resultUrl} download="satmoko-ai.mp4" className="mt-8 inline-block px-12 py-5 bg-white text-slate-950 font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] hover:bg-amber-500 transition-all">
                Ekspor Video
              </a>
            </div>
          ) : (
            <div className="text-center space-y-8 opacity-20">
               <Icons.Video />
               <p className="text-3xl font-black text-white uppercase tracking-[0.4em]">Pratinjau Saraf</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageToVideo;
