
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Profile, UserStatus, UserRole, SubscriptionType } from '../types';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isBackupLoading, setIsBackupLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUsers(data as Profile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (userId: string, days: number) => {
    const end = new Date();
    // Logic based on pre-defined days from registration
    end.setDate(end.getDate() + days);

    const { error } = await supabase.from('profiles').update({
      status: UserStatus.ACTIVE,
      expired_at: end.toISOString()
    }).eq('id', userId);

    if (error) {
      alert("Gagal menyetujui user: " + error.message);
    } else {
      fetchUsers();
    }
  };

  const handleExtend = async (userId: string, currentEnd: string | null, days: number) => {
    const start = currentEnd ? new Date(currentEnd) : new Date();
    start.setDate(start.getDate() + days);

    await supabase.from('profiles').update({
      expired_at: start.toISOString(),
      status: UserStatus.ACTIVE
    }).eq('id', userId);
    fetchUsers();
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return;
    await supabase.from('profiles').delete().eq('id', userId);
    fetchUsers();
  };

  const handleBackup = async () => {
    setIsBackupLoading(true);
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `satmoko_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Gagal melakukan backup: ' + (err as Error).message);
    } finally {
      setIsBackupLoading(false);
    }
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (!Array.isArray(data)) {
          throw new Error('Format file tidak valid. Harus berupa array data profiles.');
        }

        if (confirm(`Anda akan merestore ${data.length} data. Data yang ada akan diperbarui (upsert). Lanjutkan?`)) {
          setIsBackupLoading(true);
          const { error } = await supabase.from('profiles').upsert(data);
          if (error) throw error;
          alert('Database berhasil di-restore!');
          fetchUsers();
        }
      } catch (err) {
        alert('Gagal merestore database: ' + (err as Error).message);
      } finally {
        setIsBackupLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const getPlanLabel = (type: SubscriptionType) => {
    switch(type) {
      case SubscriptionType.MONTH1: return '1 Bulan';
      case SubscriptionType.MONTH3: return '3 Bulan';
      case SubscriptionType.YEAR1: return '1 Tahun';
      default: return type;
    }
  };

  const filteredUsers = users.filter(u => 
    u.phone.includes(searchTerm) || 
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-gray-400">Manajemen pengguna dan lisensi Satmoko AI.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex gap-2">
            <button
              onClick={handleBackup}
              disabled={isBackupLoading}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <span>📥</span> Backup
            </button>
            <button
              onClick={handleRestoreClick}
              disabled={isBackupLoading}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <span>📤</span> Restore
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".json"
            />
          </div>
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari User (Nama / Nomor HP)..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 uppercase text-[10px] tracking-widest font-bold text-gray-500">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Paket</th>
                <th className="px-6 py-4">Masa Aktif</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading users...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Tidak ada user ditemukan.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold">{user.name}</div>
                      <div className="text-[10px] text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase ${
                        user.status === UserStatus.ACTIVE ? 'text-green-400 bg-green-400/10' :
                        user.status === UserStatus.PENDING ? 'text-yellow-400 bg-yellow-400/10' :
                        'text-red-400 bg-red-400/10'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-blue-400 font-medium">{getPlanLabel(user.subscription_type)}</span>
                    </td>
                    <td className="px-6 py-4 text-[11px] text-gray-400 font-mono">
                      {user.expired_at ? new Date(user.expired_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end space-x-2">
                        {user.status === UserStatus.PENDING && (
                          <button
                            onClick={() => handleApprove(user.id, user.subscription_days)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-green-600/20"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleExtend(user.id, user.expired_at, 30)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-600/20"
                        >
                          +30 Hari
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Hapus User"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
