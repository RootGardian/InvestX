import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useFormatters } from '../hooks/useFormatters';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, Wallet, Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const COLORS = ['#7C3AED', '#5b21b6', '#4c1d95', '#10B981', '#EF4444', '#8b5cf6'];

const DashboardPage = () => {
  const { user, token, currency } = useAuth();
  const { formatCurrency } = useFormatters();
  const { t } = useTranslation();
  
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
        console.error("Erreur récupération dashboard", err);
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
      name: 'Cash',
      percent: (totalValue > 0 ? (Number(dashboardData.cashBalance) / totalValue) * 100 : 0).toFixed(1),
      color: '#10B981'
    });
  }

  // Calculate overall performance
  const totalBuyValue = assets.reduce((acc, curr) => acc + (Number(curr.averageBuyPrice) * Number(curr.quantity)), 0);
  const totalCurrentValue = assets.reduce((acc, curr) => acc + curr.currentTotalValue, 0);
  const overallPerformance = totalBuyValue > 0 ? ((totalCurrentValue - totalBuyValue) / totalBuyValue) * 100 : 0;
  const plTotal = totalCurrentValue - totalBuyValue;

  // Mock performance data for chart, ending at totalValue
  const portfolioData = [
    { name: t('dashboard.days_ago', { count: 5 }), value: totalValue * 0.95 },
    { name: t('dashboard.days_ago', { count: 4 }), value: totalValue * 0.96 },
    { name: t('dashboard.days_ago', { count: 3 }), value: totalValue * 0.99 },
    { name: t('dashboard.days_ago', { count: 2 }), value: totalValue * 0.98 },
    { name: t('dashboard.today'), value: totalValue },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-textMain mb-2">{t('dashboard.title')}</h1>
          <p className="text-textMuted flex items-center gap-2">
            {t('dashboard.welcome_text', { name: user?.name || '' })} 
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium tracking-wider uppercase"># IX-{user?.id ? user.id.substring(0, 8) : '00000000'}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* <Link to="/dashboard/deposit" className="bg-primary hover:bg-primaryHover text-white px-6 py-2 rounded-lg font-medium transition-colors">
            {t('dashboard.deposit_btn')}
          </Link> */}
          <Link to="/dashboard/buy" className="bg-primary hover:bg-primaryHover border border-primary text-white px-6 py-2 rounded-lg font-medium transition-colors">
            {t('dashboard.buy_btn')}
          </Link>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-medium text-textMuted">{t('dashboard.total_balance')}</div>
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-textMain mb-2">{formatCurrency(totalValue, currency)}</div>
          <div className={`text-sm font-medium flex items-center gap-1 ${overallPerformance >= 0 ? 'text-bullish' : 'text-bearish'}`}>
            {overallPerformance >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />} 
            {overallPerformance >= 0 ? '+' : ''}{overallPerformance.toFixed(2)}% {t('dashboard.total')}
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-medium text-textMuted">{t('dashboard.available_cash')}</div>
            <div className="w-8 h-8 rounded-lg bg-bullish/20 flex items-center justify-center text-bullish">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-textMain mb-2">{formatCurrency(dashboardData?.cashBalance || 0, currency)}</div>
          {/* <Link to="/dashboard/deposit" className="text-sm text-primary font-medium hover:text-primaryHover transition-colors">
            + {t('dashboard.add_btn')}
          </Link> */}
        </div>
        
        {/* Card 3 */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-medium text-textMuted">{t('dashboard.pl_assets')}</div>
            <div className={`w-8 h-8 rounded-lg ${plTotal >= 0 ? 'bg-bullish/10 text-bullish' : 'bg-bearish/10 text-bearish'} flex items-center justify-center`}>
              {plTotal >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            </div>
          </div>
          <div className={`text-3xl font-bold mb-2 ${plTotal >= 0 ? 'text-bullish' : 'text-bearish'}`}>
            {plTotal >= 0 ? '+' : ''}{formatCurrency(plTotal, currency)}
          </div>
          <div className={`text-sm font-medium flex items-center gap-1 ${overallPerformance >= 0 ? 'text-bullish' : 'text-bearish'}`}>
            {t('dashboard.unrealized')}
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Main Area Chart */}
        <div className="md:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-textMain mb-6">{t('dashboard.overview')}</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2532" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis 
                  stroke="#9ca3af" 
                  tick={{fill: '#9ca3af', fontSize: 12}} 
                  axisLine={false} 
                  tickLine={false}
                  domain={[dataMin => dataMin * 0.9, dataMax => dataMax * 1.1]}
                  tickFormatter={(value) => `${value.toLocaleString()}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151A22', borderColor: '#1E2532', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#7C3AED' }}
                  formatter={(value) => [formatCurrency(value, currency), t('dashboard.value')]}
                />
                <Area type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" activeDot={{ r: 6, fill: '#7C3AED', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-textMain">{t('dashboard.allocation')}</h3>
            <PieChartIcon className="w-5 h-5 text-textMuted" />
          </div>
          
          <div className="space-y-6 mt-4">
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
              <div className="text-textMuted text-sm">{t('dashboard.no_allocation')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple PieChart Icon component to match the screenshot icon
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

export default DashboardPage;
