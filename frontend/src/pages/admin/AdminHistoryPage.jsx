import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Search, User, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AdminHistoryPage = () => {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/admin/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  const filteredHistory = history.filter(tx => 
    (tx.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tx.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-textMain mb-2">Historique Global</h1>
          <p className="text-textMuted">Toutes les transactions effectuées sur la plateforme.</p>
        </div>
        
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur, actif..."
            className="bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-textMain focus:outline-none focus:border-primary w-full md:w-72"
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
                <th className="px-6 py-4 text-xs font-bold text-textMuted uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-textMuted uppercase tracking-wider">Actif</th>
                <th className="px-6 py-4 text-xs font-bold text-textMuted uppercase tracking-wider">Montant/Qté</th>
                <th className="px-6 py-4 text-xs font-bold text-textMuted uppercase tracking-wider">Prix U.</th>
                <th className="px-6 py-4 text-xs font-bold text-textMuted uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-textMuted">Chargement...</td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-textMuted">Aucune transaction trouvée.</td>
                </tr>
              ) : (
                filteredHistory.map((tx) => (
                  <tr key={tx.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-textMuted">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-textMain">{tx.user?.name || tx.user?.email.split('@')[0] || 'Unknown'}</p>
                          {tx.user?.name && <p className="text-xs text-textMuted">{tx.user.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {tx.type === 'BUY' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-bearish/10 border border-bearish/20 text-xs font-bold text-bearish">
                          <ArrowUpRight className="w-3.5 h-3.5" /> BUY
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-bullish/10 border border-bullish/20 text-xs font-bold text-bullish">
                          <ArrowDownRight className="w-3.5 h-3.5" /> SELL
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-textMain">
                      {tx.ticker}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-textMain">
                      {parseFloat(tx.quantity).toFixed(8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-textMuted">
                      ${parseFloat(tx.pricePerShare).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 4})}
                    </td>
                    <td className="px-6 py-4 text-sm text-textMuted">
                      {new Date(tx.timestamp).toLocaleString('fr-FR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute:'2-digit', second:'2-digit'
                      })}
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

export default AdminHistoryPage;
