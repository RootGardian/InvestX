import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Key, ArrowDownCircle, ArrowUpCircle, Search } from 'lucide-react';

const AdminUsersPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-textMain mb-2">Gestion Utilisateurs</h1>
          <p className="text-textMuted">Gérez les comptes clients et leurs soldes.</p>
        </div>
        
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-textMain focus:outline-none focus:border-primary w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border/50 bg-background/50">
                <th className="px-6 py-4 text-xs font-bold text-textMuted uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-4 text-xs font-bold text-textMuted uppercase tracking-wider">N° Compte</th>
                <th className="px-6 py-4 text-xs font-bold text-textMuted uppercase tracking-wider">Solde ($)</th>
                <th className="px-6 py-4 text-xs font-bold text-textMuted uppercase tracking-wider">Sécurité</th>
                <th className="px-6 py-4 text-xs font-bold text-textMuted uppercase tracking-wider text-right">Fonds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-textMuted">Chargement...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-textMuted">Aucun utilisateur trouvé.</td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#5e35b1]/20 flex items-center justify-center text-[#5e35b1]">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-textMain">{u.name || u.email.split('@')[0]}</p>
                          <p className="text-xs text-textMuted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-textMuted">
                      IX-{u.id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 font-bold text-textMain">
                      ${parseFloat(u.cashBalance).toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#e6a23c]/10 border border-[#e6a23c]/20 text-xs font-medium text-[#e6a23c]">
                        <Key className="w-3.5 h-3.5" /> Password
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 rounded bg-bullish/10 text-bullish hover:bg-bullish/20 transition-colors" title="Créditer">
                          <ArrowDownCircle className="w-5 h-5" />
                        </button>
                        <button className="p-1.5 rounded bg-bearish/10 text-bearish hover:bg-bearish/20 transition-colors" title="Débiter">
                          <ArrowUpCircle className="w-5 h-5" />
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

export default AdminUsersPage;
