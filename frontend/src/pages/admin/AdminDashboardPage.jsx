import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, DollarSign, Activity, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    transactions: 0,
    orders: 0,
    activeAlerts: 0,
    totalCashInPlatform: 0,
    totalVolume: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const statsData = await statsRes.json();
        if (statsRes.ok) setStats(statsData);

        const histRes = await fetch('/api/admin/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const histData = await histRes.json();
        if (histRes.ok) {
          // Take only top 5 recent transactions
          setRecentTransactions(histData.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [token]);

  if (isLoading) {
    return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-border rounded"></div><div className="space-y-3"><div className="grid grid-cols-3 gap-4"><div className="h-2 bg-border rounded col-span-2"></div><div className="h-2 bg-border rounded col-span-1"></div></div><div className="h-2 bg-border rounded"></div></div></div></div>;
  }

  const statCards = [
    { title: 'Utilisateurs Totaux', value: stats.users, icon: Users, color: 'text-[#5e35b1]' },
    { title: 'Balance Totale Clients', value: `$${parseFloat(stats.totalCashInPlatform).toLocaleString('en-US', {minimumFractionDigits: 2})}`, icon: DollarSign, color: 'text-bullish' },
    { title: 'Transactions Totales', value: stats.transactions, icon: Activity, color: 'text-[#e6a23c]' },
    { title: 'Volume Échangé', value: `$${parseFloat(stats.totalVolume).toLocaleString('en-US', {minimumFractionDigits: 2})}`, icon: FileText, color: 'text-[#f50057]' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-textMain mb-2">Dashboard Admin</h1>
        <p className="text-textMuted">Aperçu global des performances de la plateforme.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-textMuted">{stat.title}</h3>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-textMain">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="text-lg font-bold text-textMain">Activité de Trading</h3>
            <Link to="/admin/history" className="text-sm text-[#5e35b1] hover:text-[#7e57c2] transition-colors flex items-center">
              Voir tous <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-background/50">
                  <th className="px-6 py-4 text-xs font-bold text-textMuted uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-textMuted uppercase tracking-wider">Volume Interne ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-textMain">
                      {new Date(tx.timestamp).toISOString().split('T')[0]}
                    </td>
                    <td className="px-6 py-4 font-medium text-textMain">
                      ${parseFloat(tx.totalAmount).toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </td>
                  </tr>
                ))}
                {recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan="2" className="px-6 py-8 text-center text-textMuted">
                      Aucune transaction récente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold text-textMain mb-6">Actions Rapides</h3>
          <div className="space-y-3">
            <Link to="/admin/users" className="flex justify-between items-center p-4 rounded-xl border border-border bg-background hover:bg-border/30 transition-colors">
              <span className="text-sm text-textMain">Gérer les comptes clients</span>
              <ChevronRight className="w-4 h-4 text-textMuted" />
            </Link>
            <div className="flex justify-between items-center p-4 rounded-xl border border-border bg-background hover:bg-border/30 transition-colors cursor-pointer">
              <span className="text-sm text-textMain">Configuration du Marché</span>
              <ChevronRight className="w-4 h-4 text-textMuted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
