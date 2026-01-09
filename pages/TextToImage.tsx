
import React, { useState, useRef } from 'react';
import { ImageParams, User } from '../types';
import { IMAGE_STYLES, COLOR_GRADING, Icons } from '../constants';
import { geminiService } from '../services/geminiService';
import { dbService } from '../services/supabaseService';

interface TextToImageProps {
  user: User;
}

const TextToImage: React.FC<TextToImageProps> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [prompt, setPrompt] = useState('');
  const [refs, setRefs] = useState<string[]>([]);
  const [params, setParams] = useState<ImageParams>({
    aspectRatio: '1:1',
    style: 'Photorealistic 8K',
    colorGrading: 'Natural'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRefUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRefs(prev => [...prev, reader.result as string].slice(-3));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Perintah input saraf diperlukan.');
      return;
    }

    if (user.status !== 'approved') {
      setError('Akses ditangguhkan. Akun Anda belum disetujui admin.');
      return;
    }

    setLoading(true);
    setError(null);
    setResultUrl(null);

    try {
      const imageUrl = await geminiService.generateImage(prompt, { ...params, referenceImages: refs });
      setResultUrl(imageUrl);
      
      const record = {
        userId: user.id,
        type: 'image',
        prompt,
        resultUrl: imageUrl,
        params: { ...params, refsCount: refs.length }
      };
      await dbService.saveRecord(record);
    } catch (err: any) {
      setError(err.message || 'Kesalahan mesin sintesis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn pb-20">
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-8">
          {/* Prompt Section */}
          <div className="space-y-3">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Deskripsi Visual</label>
            <textarea 
              className="w-full p-5 bg-slate-800/50 border border-slate-700 rounded-3xl text-sm outline-none min-h-[150px] text-white placeholder:text-slate-600 leading-relaxed focus:border-blue-500/50 transition-all"
              placeholder="Jelaskan konsep visual Anda secara detail..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {/* Configuration Grid */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Rasio Aspek</label>
                <select 
                  className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                  value={params.aspectRatio}
                  onChange={(e) => setParams({...params, aspectRatio: e.target.value as any})}
                >
                  <option value="1:1">1:1 (Kotak)</option>
                  <option value="3:4">3:4 (Portrait)</option>
                  <option value="4:3">4:3 (Landscape)</option>
                  <option value="9:16">9:16 (Story)</option>
                  <option value="16:9">16:9 (Cinematic)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Gradasi Warna</label>
                <select 
                  className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                  value={params.colorGrading}
                  onChange={(e) => setParams({...params, colorGrading: e.target.value})}
                >
                  {COLOR_GRADING.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Gaya Artistik (Style Gambar)</label>
              <select 
                className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500 appearance-none cursor-pointer"
                value={params.style}
                onChange={(e) => setParams({...params, style: e.target.value})}
              >
                {IMAGE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Reference Images */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Referensi Visual (Maks 3)</label>
            <div className="flex gap-3">
              {refs.map((ref, idx) => (
                <div key={idx} className="group relative w-16 h-16 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
                  <img src={ref} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setRefs(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              ))}
              {refs.length < 3 && (
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="w-16 h-16 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 hover:text-blue-400 hover:border-blue-400/50 transition-all flex items-center justify-center text-xl font-light"
                >
                  +
                </button>
              )}
            </div>
            <input type="file" hidden multiple ref={fileInputRef} accept="image/*" onChange={handleRefUpload} />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black tracking-[0.2em] hover:bg-blue-500 transition-all uppercase active:scale-95 shadow-xl shadow-blue-900/20 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Sintesis...</span>
              </div>
            ) : 'Wujudkan Visi'}
          </button>
          {error && <p className="text-red-400 text-[10px] text-center font-black tracking-widest uppercase mt-2">{error}</p>}
        </div>
      </div>

      <div className="lg:col-span-8">
        <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-slate-800 min-h-[600px] flex flex-col items-center justify-center relative shadow-2xl group overflow-hidden">
          {loading ? (
            <div className="text-center space-y-8 relative z-10">
              <div className="w-24 h-24 border-[6px] border-slate-800 border-t-blue-500 rounded-full animate-spin mx-auto shadow-2xl"></div>
              <div>
                <p className="text-white font-black text-xl tracking-[0.4em] uppercase animate-pulse">Materialisasi Data Visual</p>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Mesin Gemini 2.5 Flash sedang merakit piksel...</p>
              </div>
            </div>
          ) : resultUrl ? (
            <div className="w-full text-center animate-fadeIn">
              <img src={resultUrl} className="w-full max-h-[700px] object-contain rounded-[2rem] shadow-2xl border border-slate-800" />
              <div className="mt-12 flex justify-center gap-4">
                <a href={resultUrl} download="satmoko-ai.png" className="px-12 py-5 bg-blue-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl">
                  Unduh Aset
                </a>
                <button 
                  onClick={() => { setResultUrl(null); setPrompt(''); }}
                  className="px-8 py-5 bg-slate-800 text-slate-400 font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] hover:bg-slate-700 transition-all"
                >
                  Buat Baru
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center opacity-20 space-y-10">
               <div className="scale-[2] text-slate-700 flex justify-center"><Icons.Image /></div>
               <p className="text-4xl font-black text-white uppercase tracking-[0.5em] select-none">Kanvas Saraf</p>
            </div>
          )}
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default TextToImage;
