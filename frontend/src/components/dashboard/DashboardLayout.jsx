import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  PlusCircle, 
  BarChart2, 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  User, 
  LogOut,
  Menu,
  X,
  ArrowLeftRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../utils/currency';

const livePrices = [
  { symbol: 'ETH', price: 3456.78, change: '-1.2%', isUp: false },
  { symbol: 'SOL', price: 145.67, change: '+5.67%', isUp: true },
  { symbol: 'AAPL', price: 178.45, change: '+0.85%', isUp: true },
  { symbol: 'NVDA', price: 890.12, change: '+3.12%', isUp: true },
  { symbol: 'BTC', price: 65432.10, change: '+2.45%', isUp: true },
  { symbol: 'TSLA', price: 175.34, change: '-3.10%', isUp: false },
];

const DashboardLayout = () => {
  const { logout, user, currency } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.portfolio'), href: '/dashboard/portfolio', icon: Wallet },
    // { name: t('nav.deposit'), href: '/dashboard/deposit', icon: PlusCircle },
    { name: t('nav.markets'), href: '/dashboard/markets', icon: BarChart2 },
    { name: t('nav.buy'), href: '/dashboard/buy', icon: TrendingUp },
    { name: t('nav.sell'), href: '/dashboard/sell', icon: TrendingDown },
    { name: t('nav.alerts'), href: '/dashboard/alerts', icon: Bell },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavItem = ({ item, onClick }) => {
    const isActive = location.pathname === item.href;
    return (
      <Link
        to={item.href}
        onClick={onClick}
        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all mb-1 ${
          isActive 
            ? 'bg-primary text-white shadow-lg shadow-primary/25' 
            : 'text-textMuted hover:bg-card hover:text-textMain'
        }`}
      >
        <item.icon className={`mr-4 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-textMuted group-hover:text-textMain'}`} />
        {item.name}
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden text-textMain font-sans">
      
      {/* Sidebar (Desktop) */}
      <div className="hidden md:flex md:w-[280px] md:flex-col border-r border-border bg-card">
        <div className="flex flex-col flex-grow pt-8 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-8 mb-10">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="bg-primary w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-lg">IX</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-textMain">InvestX</span>
            </Link>
          </div>
          
          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
            
            {user?.role === 'ADMIN' && (
              <div className="mt-8 pt-8 border-t border-border">
                <Link
                  to="/admin"
                  className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-textMuted hover:bg-card hover:text-textMain transition-all"
                >
                  <ArrowLeftRight className="mr-4 h-5 w-5 flex-shrink-0 text-textMuted group-hover:text-textMain" />
                  {t('nav.back_admin')}
                </Link>
              </div>
            )}
          </nav>
        </div>
        
        {/* Footer Sidebar */}
        <div className="flex-shrink-0 p-4 border-t border-border mt-auto">
          <Link
            to="/dashboard/profile"
            className="group flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl text-textMuted hover:bg-card hover:text-textMain transition-colors mb-2"
          >
            <User className="mr-4 h-5 w-5 flex-shrink-0" />
            {t('nav.profile')}
          </Link>
          <button
            onClick={handleLogout}
            className="group flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl text-bearish hover:bg-bearish/10 transition-colors"
          >
            <LogOut className="mr-4 h-5 w-5 flex-shrink-0" />
            {t('nav.logout')}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        
        {/* Top Ticker Bar */}
        <div className="h-12 bg-card border-b border-border flex items-center overflow-hidden flex-shrink-0 relative">
          <button
            className="px-4 text-textMuted focus:outline-none md:hidden z-10 bg-card absolute left-0 h-full flex items-center border-r border-border"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex-1 overflow-hidden relative h-full md:pl-4 pl-16">
            <div className="flex items-center h-full animate-[ticker_40s_linear_infinite] whitespace-nowrap">
              {[...livePrices, ...livePrices, ...livePrices].map((item, i) => (
                <div key={i} className="flex items-center mx-6 gap-2">
                  <span className="text-white font-bold text-sm">{item.symbol}</span>
                  <span className="text-textMuted text-sm">{formatCurrency(item.price, currency)}</span>
                  <span className={`text-sm flex items-center font-medium ${item.isUp ? 'text-bullish' : 'text-bearish'}`}>
                    {item.isUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-background custom-scrollbar">
          <div className="p-6 md:p-10 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-[280px] w-full bg-card h-full shadow-2xl">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-card"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6 text-textMuted" />
              </button>
            </div>
            
            <div className="flex items-center flex-shrink-0 px-8 py-8">
              <div className="flex items-center gap-3">
                <div className="bg-primary w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-white font-bold text-lg">IX</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-textMain">InvestX</span>
              </div>
            </div>

            <div className="flex-1 h-0 overflow-y-auto px-4 space-y-1">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} onClick={() => setIsMobileMenuOpen(false)} />
              ))}

              {user?.role === 'ADMIN' && (
                <div className="mt-8 pt-8 border-t border-border">
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-textMuted hover:bg-card hover:text-textMain transition-all"
                  >
                    <ArrowLeftRight className="mr-4 h-5 w-5 flex-shrink-0 text-textMuted group-hover:text-textMain" />
                    {t('nav.back_admin')}
                  </Link>
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0 border-t border-border p-4">
              <Link
                to="/dashboard/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="group flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl text-textMuted hover:bg-card hover:text-textMain transition-colors mb-2"
              >
                <User className="mr-4 h-5 w-5 flex-shrink-0" />
                {t('nav.profile')}
              </Link>
              <button onClick={handleLogout} className="flex-shrink-0 group w-full text-left px-4 py-3 rounded-xl hover:bg-bearish/10 transition-colors">
                <div className="flex items-center">
                  <LogOut className="h-5 w-5 mr-4 text-bearish" />
                  <p className="text-sm font-medium text-bearish">{t('nav.logout')}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
