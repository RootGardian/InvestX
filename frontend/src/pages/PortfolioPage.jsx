import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { Wallet, DollarSign, Loader2 } from 'lucide-react';
import { useFormatters } from '../hooks/useFormatters';
import { useAuth } from '../contexts/AuthContext';

const COLORS = ['#7C3AED', '#5b21b6', '#4c1d95', '#10B981', '#EF4444', '#8b5cf6'];

const PortfolioPage = () => {
  const { formatCurrency } = useFormatters();
  const { token, user } = useAuth();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiFetch('/api/dashboard/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Erreur récupération portfolio", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-textMuted">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const assets = dashboardData?.assets || [];
  const totalValue = dashboardData?.totalAssetsValue || 0;
  
  // Calculate allocation
  const allocationData = assets.map((asset, index) => {
    const percent = totalValue > 0 ? (asset.currentTotalValue / totalValue) * 100 : 0;
    return {
      name: asset.ticker,
      percent: percent.toFixed(1),
      color: COLORS[index % COLORS.length]
    };
  });
  
  if (dashboardData?.cashBalance > 0) {
    allocationData.push({
      name: 'Cash (USD)',
      percent: (totalValue > 0 ? (Number(dashboardData.cashBalance) / totalValue) * 100 : 0).toFixed(1),
      color: '#10B981'
    });
  }

  // Calculate overall performance
  const totalBuyValue = assets.reduce((acc, curr) => acc + (Number(curr.averageBuyPrice) * Number(curr.quantity)), 0);
  const totalCurrentValue = assets.reduce((acc, curr) => acc + curr.currentTotalValue, 0);
  const overallPerformance = totalBuyValue > 0 ? ((totalCurrentValue - totalBuyValue) / totalBuyValue) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-textMain mb-2">Mon Portefeuille</h1>
          <p className="text-textMuted">Analyse de vos performances.</p>
        </div>
        <div className="bg-card border border-border px-4 py-2 rounded-lg text-sm text-textMain font-medium">
          Statut: Actif
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-medium text-textMuted">Valeur Totale</div>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-textMain mb-2">{formatCurrency(totalValue)}</div>
          <div className={`text-sm font-medium flex items-center gap-1 ${overallPerformance >= 0 ? 'text-bullish' : 'text-bearish'}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points={overallPerformance >= 0 ? "22 7 13.5 15.5 8.5 10.5 2 17" : "22 17 13.5 8.5 8.5 13.5 2 7"}></polyline><polyline points={overallPerformance >= 0 ? "16 7 22 7 22 13" : "16 17 22 17 22 11"}></polyline></svg>
            {overallPerformance >= 0 ? '+' : ''}{overallPerformance.toFixed(2)}%
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-medium text-textMuted">Solde Disponible</div>
            <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-bullish">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-textMain mb-2">{formatCurrency(dashboardData?.cashBalance || 0)}</div>
          <div className="text-sm text-textMuted">Disponible</div>
        </div>
        
        {/* Allocation */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-textMain">Allocation</h3>
            <PieChartIcon className="w-5 h-5 text-primary" />
          </div>
          
          <div className="space-y-4">
            {allocationData.length > 0 ? allocationData.map(asset => (
              <div key={asset.name}>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-textMain font-medium">{asset.name}</span>
                  <span className="text-textMuted">{asset.percent}%</span>
                </div>
                <div className="w-full bg-background rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{ width: `${asset.percent}%`, backgroundColor: asset.color }}></div>
                </div>
              </div>
            )) : (
              <div className="text-textMuted text-sm">Aucune allocation</div>
            )}
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mt-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-textMuted text-sm">
              <th className="p-6 font-medium">Actif</th>
              <th className="p-6 font-medium">Quantité</th>
              <th className="p-6 font-medium">Prix Moyen</th>
              <th className="p-6 font-medium">Prix Actuel</th>
              <th className="p-6 font-medium">Valeur</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {assets.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-textMuted">Vous ne possédez aucun actif.</td>
              </tr>
            ) : (
              assets.map((asset, idx) => (
                <tr key={idx} className="hover:bg-background/50 transition-colors">
                  <td className="p-6 font-bold text-textMain">{asset.ticker}</td>
                  <td className="p-6 font-medium text-textMain">{Number(asset.quantity).toFixed(4)}</td>
                  <td className="p-6 text-textMuted">{formatCurrency(asset.averageBuyPrice)}</td>
                  <td className="p-6 text-textMuted">{formatCurrency(asset.currentPrice)}</td>
                  <td className="p-6 font-bold text-textMain flex items-center gap-2">
                    {formatCurrency(asset.currentTotalValue)}
                    <span className={`text-xs px-2 py-1 rounded-md ${Number(asset.performancePercentage) >= 0 ? 'bg-bullish/10 text-bullish' : 'bg-bearish/10 text-bearish'}`}>
                      {Number(asset.performancePercentage) >= 0 ? '+' : ''}{asset.performancePercentage}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function PieChartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  )
}

export default PortfolioPage;
