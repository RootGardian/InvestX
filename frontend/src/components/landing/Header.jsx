import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Activity, User, LayoutDashboard, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, token, language, updateLanguage } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight text-textMain">InvestX</span>
            </Link>
          </div>

          {/* Desktop Nav - Hidden if logged in */}
          {!token && (
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/markets" className="text-sm font-medium text-textMuted hover:text-textMain transition-colors">{t('header.markets')}</Link>
              <Link to="/orderbook" className="text-sm font-medium text-textMuted hover:text-textMain transition-colors">{t('header.tools')}</Link>
              <Link to="/pricing" className="text-sm font-medium text-textMuted hover:text-textMain transition-colors">{t('header.pricing')}</Link>
            </nav>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center mr-4 border-r border-border pr-4">
              <Globe className="w-4 h-4 text-textMuted mr-2" />
              <select 
                value={language}
                onChange={(e) => updateLanguage(e.target.value)}
                className="bg-transparent text-sm font-medium text-textMuted focus:outline-none cursor-pointer hover:text-textMain"
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
              </select>
            </div>
            
            <Link to="/auth" className="text-sm font-medium text-textMuted hover:text-textMain transition-colors">
              {t('header.signin')}
            </Link>
            <Link to="/auth" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primaryHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all">
              {t('header.signup')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-textMuted hover:text-textMain hover:bg-card focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {!token && (
              <>
                <Link to="/markets" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-textMuted hover:text-textMain hover:bg-background rounded-md">{t('header.markets')}</Link>
                <Link to="/orderbook" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-textMuted hover:text-textMain hover:bg-background rounded-md">{t('header.tools')}</Link>
                <Link to="/pricing" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-textMuted hover:text-textMain hover:bg-background rounded-md">{t('header.pricing')}</Link>
              </>
            )}
            
            <div className="px-3 py-2 flex items-center justify-between border-t border-border mt-2 pt-4">
              <span className="text-sm text-textMuted">Langue</span>
              <select 
                value={language}
                onChange={(e) => updateLanguage(e.target.value)}
                className="bg-card text-sm font-medium text-textMain border border-border rounded-md px-2 py-1 focus:outline-none"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-3">
              <Link to="/auth" onClick={() => setIsOpen(false)} className="w-full text-center rounded-md border border-border px-4 py-2 text-sm font-semibold text-textMain hover:bg-background transition-colors">
                {t('header.signin')}
              </Link>
              <Link to="/auth" onClick={() => setIsOpen(false)} className="w-full text-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primaryHover transition-colors">
                {t('header.signup')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
