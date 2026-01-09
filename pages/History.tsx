
import React, { useState, useEffect } from 'react';
import { GenerationRecord, User } from '../types';
import { dbService } from '../services/supabaseService';

interface HistoryProps {
  user: User;
}

const History: React.FC<HistoryProps> = ({ user }) => {
  const [records, setRecords] = useState<GenerationRecord[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchHistory = async () => {
      const history = await dbService.getRecords(user.id);
      setRecords(history);
    };
    fetchHistory();
  }, [user.id]);

  const totalPages = Math.ceil(records.length / itemsPerPage);
  const paginatedRecords = records.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-end justify-between border-b border-slate-800 pb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Arsip Karya</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Aset Generatif Yang Disimpan</p>
        </div>
        <div className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-amber-500/20">
          {records.length} Siklus Tercatat
        </div>
      </div>

      {records.length === 0 ? (
        <div className="bg-slate-900/40 p-24 rounded-[3rem] border border-slate-800 text-center space-y-6">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600 border border-slate-700">
             <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" strokeWidth="2"/></svg>
          </div>
          <p className="text-slate-500 font-bold tracking-[0.2em] uppercase text-xs">Belum ada riwayat kreasi yang ditemukan</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedRecords.map(record => (
              <div key={record.id} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-amber-500/30 transition-all duration-500 shadow-2xl">
                <div className="aspect-square relative overflow-hidden bg-slate-950">
                  {record.type === 'image' ? (
                    <img src={record.result_url} alt={record.prompt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <video src={record.result_url} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-4 right-4 bg-slate-950/80 text-white text-[9px] px-3 py-1 rounded-full backdrop-blur-md uppercase font-black tracking-widest border border-slate-800">
                    {record.type === 'image' ? 'Gambar' : 'Video'}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-[11px] text-slate-400 line-clamp-2 italic leading-relaxed">"{record.prompt}"</p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{new Date(record.created_at).toLocaleDateString('id-ID')}</span>
                    <a 
                      href={record.result_url} 
                      download 
                      className="text-[10px] font-black text-amber-500 hover:text-amber-400 uppercase tracking-widest transition-colors"
                    >
                      Ekspor
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-8 pt-12">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-12 h-12 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-amber-500 disabled:opacity-20 transition-all active:scale-90"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M15 19l-7-7 7-7"/></svg>
              </button>
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Halaman {page} dari {totalPages}</span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-12 h-12 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-amber-500 disabled:opacity-20 transition-all active:scale-90"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;
