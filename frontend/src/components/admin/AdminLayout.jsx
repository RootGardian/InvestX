import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  History, 
  ArrowLeftRight,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Gestion Utilisateurs', href: '/admin/users', icon: Users },
    { name: 'Historique Global', href: '/admin/history', icon: History },
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
            ? 'bg-[#5e35b1] text-white shadow-lg shadow-[#5e35b1]/25' 
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
      <div className="hidden md:flex md:w-[280px] md:flex-col border-r border-border bg-[#0d1117]">
        <div className="flex flex-col flex-grow pt-8 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-8 mb-10">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="bg-[#5e35b1] w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-[#5e35b1]/20">
                <span className="text-white font-bold text-lg">IX</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-textMain">InvestX</span>
            </Link>
          </div>
          
          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
            
            <div className="mt-8 pt-8 border-t border-border">
              <Link
                to="/dashboard"
                className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-textMuted hover:bg-card hover:text-textMain transition-all"
              >
                <ArrowLeftRight className="mr-4 h-5 w-5 flex-shrink-0 text-textMuted group-hover:text-textMain" />
                Vue Client
              </Link>
            </div>
          </nav>
        </div>
        
        {/* Footer Sidebar */}
        <div className="flex-shrink-0 p-4 border-t border-border mt-auto">
          <Link
            to="/admin/profile"
            className="group flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl text-textMuted hover:bg-card hover:text-textMain transition-colors mb-2"
          >
            <User className="mr-4 h-5 w-5 flex-shrink-0" />
            Profil
          </Link>
          <button
            onClick={handleLogout}
            className="group flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl text-bearish hover:bg-bearish/10 transition-colors"
          >
            <LogOut className="mr-4 h-5 w-5 flex-shrink-0" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        
        {/* Top bar mobile only */}
        <div className="h-14 md:hidden bg-[#0B0E14] border-b border-border flex items-center justify-between px-4">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="bg-[#5e35b1] w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IX</span>
            </div>
          </Link>
          <button
            className="text-textMuted focus:outline-none bg-[#0B0E14]"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
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
          <div className="relative flex-1 flex flex-col max-w-[280px] w-full bg-[#0d1117] h-full shadow-2xl">
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
                <div className="bg-[#5e35b1] w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-[#5e35b1]/20">
                  <span className="text-white font-bold text-lg">IX</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-textMain">InvestX Admin</span>
              </div>
            </div>

            <div className="flex-1 h-0 overflow-y-auto px-4 space-y-1">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} onClick={() => setIsMobileMenuOpen(false)} />
              ))}
              <div className="mt-8 pt-8 border-t border-border">
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-textMuted hover:bg-card hover:text-textMain transition-all"
                >
                  <ArrowLeftRight className="mr-4 h-5 w-5 flex-shrink-0 text-textMuted group-hover:text-textMain" />
                  Vue Client
                </Link>
              </div>
            </div>
            
            <div className="flex-shrink-0 border-t border-border p-4">
              <Link
                to="/admin/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="group flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl text-textMuted hover:bg-card hover:text-textMain transition-colors mb-2"
              >
                <User className="mr-4 h-5 w-5 flex-shrink-0" />
                Profil
              </Link>
              <button onClick={handleLogout} className="flex-shrink-0 group w-full text-left px-4 py-3 rounded-xl hover:bg-bearish/10 transition-colors">
                <div className="flex items-center">
                  <LogOut className="h-5 w-5 mr-4 text-bearish" />
                  <p className="text-sm font-medium text-bearish">Déconnexion</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
