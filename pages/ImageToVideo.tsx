
<<<<<<< HEAD
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
=======
import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
import { UserStatus } from '../types';

const ImageToVideo: React.FC = () => {
  const { profile } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [duration, setDuration] = useState<3 | 6 | 8>(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const isExpired = profile?.status === UserStatus.EXPIRED || profile?.status === UserStatus.SUSPENDED;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
>>>>>>> b52a159 (Initial commit SATMOKO Creative Studio AI)
    }
  };

  const handleGenerate = async () => {
<<<<<<< HEAD
    if (!imageB64 || !prompt) {
      setError('Bingkai sumber atau perintah teks belum lengkap.');
      return;
    }

    if (user.status !== 'approved') {
      setError('Akses dibatasi. Langganan Anda perlu diaktifkan oleh admin.');
=======
    if (isExpired) {
      setError('Masa aktif paket Anda telah habis.');
>>>>>>> b52a159 (Initial commit SATMOKO Creative Studio AI)
      return;
    }

    setLoading(true);
<<<<<<< HEAD
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
=======
    setError('');
    setStatusMsg('Memulai proses Veo...');

    try {
      // Simulate status updates for user experience as Veo can take minutes
      const statuses = [
        'Menganalisis gambar...',
        'Memproses gerakan video...',
        'Hampir selesai...',
        'Sedang merender hasil final...'
      ];
      
      let statusIdx = 0;
      const statusInterval = setInterval(() => {
        if (statusIdx < statuses.length) {
          setStatusMsg(statuses[statusIdx]);
          statusIdx++;
        }
      }, 15000);

      const videoUrl = await GeminiService.generateVideo(prompt, image || undefined, duration);
      clearInterval(statusInterval);
      setResult(videoUrl);
    } catch (err: any) {
      setError('Gagal menghasilkan video. Veo memerlukan waktu beberapa menit atau sedang sibuk.');
    } finally {
      setLoading(false);
      setStatusMsg('');
>>>>>>> b52a159 (Initial commit SATMOKO Creative Studio AI)
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold">Image to Video</h1>
        <p className="text-gray-400">Hidupkan foto Anda dengan AI Video tercanggih.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Upload Referensi Gambar (Opsional)</label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full h-40 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-4 transition-all ${image ? 'border-blue-500/50 bg-blue-500/5' : 'group-hover:border-white/20 bg-white/5'}`}>
                  {image ? (
                    <img src={image} alt="Upload preview" className="h-full object-contain rounded-lg" />
                  ) : (
                    <>
                      <div className="text-3xl mb-2">📸</div>
                      <p className="text-xs text-gray-500">Klik atau seret gambar ke sini</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Prompt Gerakan</label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none min-h-[80px] resize-none"
                placeholder="Misal: Kamera perlahan mendekat ke wajah, rambut tertiup angin..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Durasi</label>
              <div className="flex gap-2">
                {[3, 6, 8].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d as 3 | 6 | 8)}
                    className={`flex-1 py-2 text-xs rounded-lg border transition-all ${
                      duration === d
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {d} Detik
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || isExpired}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex flex-col items-center">
                   <span className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Proses Sedang Berjalan...</span>
                  </span>
                  <span className="text-[10px] mt-1 font-normal opacity-70 italic">{statusMsg}</span>
                </span>
              ) : 'Generate Video'}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
              {error}
            </div>
          )}
        </div>

        <div className="glass-card rounded-3xl overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-gray-500">Video Result</span>
            {result && (
              <a href={result} download="satmoko-ai-video.mp4" className="text-blue-400 text-xs hover:underline">Download MP4</a>
            )}
          </div>
          <div className="flex-1 flex items-center justify-center p-4 bg-[#050505]">
            {result ? (
              <video src={result} controls autoPlay loop className="max-w-full rounded-xl shadow-2xl" />
            ) : (
              <div className="text-center space-y-4 opacity-30">
                <div className="text-6xl">🎬</div>
                <p className="text-sm">Video akan muncul di sini</p>
              </div>
            )}
          </div>
        </div>
>>>>>>> b52a159 (Initial commit SATMOKO Creative Studio AI)
      </div>
    </div>
  );
};

export default ImageToVideo;
