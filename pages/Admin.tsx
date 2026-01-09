
import React, { useState, useEffect } from 'react';
import { User, UserStatus } from '../types';
import { dbService } from '../services/supabaseService';

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | UserStatus>(UserStatus.PENDING);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    const allUsers = await dbService.getUsers();
    setUsers(allUsers);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000); // 10s refresh
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    // Default 30 hari jika belum diset
    await dbService.updateUserStatus(userId, UserStatus.APPROVED, 30);
    refreshData();
    alert(`BERHASIL: Akses ${user.name} telah diaktifkan.`);
  };

  const handleExtend = async (userId: string, days: number) => {
    await dbService.updateUserStatus(userId, UserStatus.APPROVED, days);
    refreshData();
  };

  const handleDelete = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (confirm(`HAPUS PERMANEN: Anda yakin ingin menghapus akun ${user?.name}?`)) {
      await dbService.deleteUser(userId);
      refreshData();
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesTab = activeTab === 'all' || user.status === activeTab;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.phone.includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  const counts = {
    total: users.length,
    pending: users.filter(u => u.status === UserStatus.PENDING).length,
    active: users.filter(u => u.status === UserStatus.APPROVED).length
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Dashboard Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Artist Terdaftar</p>
          <p className="text-4xl font-black text-white mt-2">{counts.total}</p>
        </div>
        
        <button 
          onClick={() => setActiveTab(UserStatus.PENDING)}
          className={`relative border p-8 rounded-[2.5rem] shadow-2xl transition-all text-left group ${
            activeTab === UserStatus.PENDING 
            ? 'bg-amber-500/10 border-amber-500 shadow-amber-500/10' 
            : 'bg-slate-900 border-slate-800 hover:border-amber-500/50'
          }`}
        >
          <p className={`text-[10px] font-black uppercase tracking-widest ${activeTab === UserStatus.PENDING ? 'text-amber-500' : 'text-slate-500'}`}>
            Butuh Persetujuan
          </p>
          <p className={`text-4xl font-black mt-2 ${counts.pending > 0 ? 'text-amber-500 animate-pulse' : 'text-white'}`}>
            {counts.pending}
          </p>
          {counts.pending > 0 && (
            <div className="absolute top-6 right-6 w-3 h-3 bg-amber-500 rounded-full animate-ping"></div>
          )}
        </button>

        <button 
          onClick={() => setActiveTab(UserStatus.APPROVED)}
          className={`border p-8 rounded-[2.5rem] shadow-2xl transition-all text-left ${
            activeTab === UserStatus.APPROVED 
            ? 'bg-green-500/10 border-green-500 shadow-green-500/10' 
            : 'bg-slate-900 border-slate-800 hover:border-green-500/50'
          }`}
        >
          <p className={`text-[10px] font-black uppercase tracking-widest ${activeTab === UserStatus.APPROVED ? 'text-green-500' : 'text-slate-500'}`}>
            Akses Aktif
          </p>
          <p className="text-4xl font-black text-white mt-2">{counts.active}</p>
        </button>
      </div>

      {/* Kontrol & Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex flex-col lg:flex-row justify-between items-center gap-6 bg-slate-950/40">
          <div className="flex bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700 w-full lg:w-auto">
            <button 
              onClick={() => setActiveTab(UserStatus.PENDING)}
              className={`flex-1 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === UserStatus.PENDING ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              Menunggu ({counts.pending})
            </button>
            <button 
              onClick={() => setActiveTab(UserStatus.APPROVED)}
              className={`flex-1 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === UserStatus.APPROVED ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              Aktif ({counts.active})
            </button>
            <button 
              onClick={() => setActiveTab('all')}
              className={`flex-1 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              Semua
            </button>
          </div>
          
          <div className="relative w-full lg:w-96">
            <input 
              type="text" 
              placeholder="Cari Nama atau Nomor HP..." 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-sm text-white focus:border-amber-500 outline-none transition-all pl-14"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabel Member */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/80 border-b border-slate-800">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Identitas Member</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">WhatsApp</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Sisa Akses</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center text-slate-600 font-bold uppercase text-[10px] tracking-widest">
                    {isLoading ? 'Mengambil data...' : 'Tidak ada data'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const remaining = dbService.getRemainingDays(user.expired_at);
                  return (
                    <tr key={user.id} className="hover:bg-slate-800/10 transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-black text-amber-500 border border-slate-700">
                            {user.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-white text-md tracking-tight">{user.name}</p>
                            <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">
                              JOIN: {new Date(user.created_at).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="text-xs font-mono text-slate-400">{user.phone}</span>
                      </td>
                      <td className="px-10 py-8">
                        <p className={`text-lg font-black ${remaining > 0 ? 'text-white' : 'text-red-500'}`}>
                          {remaining} HARI
                        </p>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex justify-end gap-3 items-center">
                          {user.status === UserStatus.PENDING && (
                            <button 
                              onClick={() => handleApprove(user.id)}
                              className="px-6 py-3 bg-amber-500 text-slate-950 text-[9px] font-black rounded-xl uppercase tracking-[0.1em] hover:bg-amber-400"
                            >
                              SETUJUI
                            </button>
                          )}
                          <button onClick={() => handleExtend(user.id, 30)} className="text-[9px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest">+30D</button>
                          <button onClick={() => handleDelete(user.id)} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                             <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
