
import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  onImageSelect: (b64: string) => void;
  label: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, label }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageSelect(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center bg-slate-900/50 hover:border-amber-500/50 hover:bg-slate-800/50 transition-all cursor-pointer min-h-[180px] group overflow-hidden shadow-inner"
      >
        {preview ? (
          <div className="relative w-full h-full flex justify-center">
            <img src={preview} alt="Pratinjau" className="max-h-40 rounded-2xl object-contain shadow-2xl" />
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-sm">
               <span className="text-[10px] font-black text-white uppercase tracking-widest bg-slate-900 px-4 py-2 rounded-xl">Ganti Gambar</span>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-slate-800 rounded-[1.5rem] flex items-center justify-center mx-auto text-slate-500 group-hover:text-amber-500 group-hover:bg-slate-700 transition-all shadow-lg border border-slate-700">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <p className="text-[11px] text-slate-500 uppercase font-black tracking-[0.2em] group-hover:text-slate-300">Unggah Sumber Visual</p>
          </div>
        )}
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleFileChange} 
        />
      </div>
    </div>
  );
};

export default ImageUploader;
