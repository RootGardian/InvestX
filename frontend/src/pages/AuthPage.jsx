import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AuthPage = () => {
  const { t } = useTranslation();
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Erreur lors de la connexion');
      
      login(data.accessToken, data.user);
      if (data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Erreur lors de l\'inscription');
      
      login(data.accessToken, data.user);
      if (data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-background p-4 py-20">
      
      {/* Main Container - Adjusted for Dark Mode FinTech Theme */}
      <div className="relative overflow-hidden w-full max-w-[850px] min-h-[550px] bg-card border border-border rounded-2xl shadow-2xl">
        
        {/* =========================================
            SIGN IN FORM (LEFT SIDE)
            ========================================= */}
        <div 
          className={`absolute top-0 left-0 h-full w-1/2 flex items-center justify-center px-10 transition-all duration-600 ease-in-out ${
            isSignUpActive ? 'opacity-0 z-0 pointer-events-none translate-x-[20%]' : 'opacity-100 z-10 translate-x-0'
          }`}
        >
          <form onSubmit={handleLogin} className="flex flex-col items-center justify-center w-full text-center h-full">
            <h1 className="text-3xl font-bold text-textMain mb-2 tracking-tight">{t('auth.login_title')}</h1>
            <p className="text-sm text-textMuted mb-4">{t('auth.login_subtitle')}</p>
            
            {error && !isSignUpActive && <div className="w-full p-3 mb-4 bg-bearish/10 border border-bearish/20 text-bearish rounded text-sm">{error}</div>}

            <input 
              type="email" 
              placeholder={t('auth.email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background border border-border px-4 py-3 rounded-lg mb-4 text-textMain placeholder-textMuted focus:outline-none focus:border-primary transition-colors"
            />
            <div className="relative w-full mb-4">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder={t('auth.password_placeholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-background border border-border px-4 py-3 rounded-lg text-textMain placeholder-textMuted focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            <a href="#" className="text-sm text-textMuted mb-8 hover:text-primary transition-colors">{t('auth.forgot_password')}</a>
            
            <button 
              type="submit" 
              disabled={loading}
              className="px-12 py-3 w-full rounded-lg bg-primary text-white font-bold text-sm tracking-wider uppercase hover:bg-primaryHover transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? t('auth.login_loading') : t('auth.login_btn')}
            </button>
          </form>
        </div>

        {/* =========================================
            SIGN UP FORM (RIGHT SIDE)
            ========================================= */}
        <div 
          className={`absolute top-0 right-0 h-full w-1/2 flex items-center justify-center px-10 transition-all duration-600 ease-in-out ${
            !isSignUpActive ? 'opacity-0 z-0 pointer-events-none -translate-x-[20%]' : 'opacity-100 z-10 translate-x-0'
          }`}
        >
          <form onSubmit={handleRegister} className="flex flex-col items-center justify-center w-full text-center h-full">
            <h1 className="text-3xl font-bold text-textMain mb-2 tracking-tight">{t('auth.signup_title')}</h1>
            <p className="text-sm text-textMuted mb-4">{t('auth.signup_subtitle')}</p>
            
            {error && isSignUpActive && <div className="w-full p-3 mb-4 bg-bearish/10 border border-bearish/20 text-bearish rounded text-sm">{error}</div>}

            <input 
              type="text" 
              placeholder={t('auth.name_placeholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-background border border-border px-4 py-3 rounded-lg mb-4 text-textMain placeholder-textMuted focus:outline-none focus:border-primary transition-colors"
            />
            <input 
              type="email" 
              placeholder={t('auth.email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background border border-border px-4 py-3 rounded-lg mb-4 text-textMain placeholder-textMuted focus:outline-none focus:border-primary transition-colors"
            />
            <div className="relative w-full mb-8">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder={t('auth.password_placeholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-background border border-border px-4 py-3 rounded-lg text-textMain placeholder-textMuted focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="px-12 py-3 w-full rounded-lg bg-primary text-white font-bold text-sm tracking-wider uppercase hover:bg-primaryHover transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? t('auth.signup_loading') : t('auth.signup_btn')}
            </button>
          </form>
        </div>

        {/* =========================================
            SLIDING OVERLAY
            ========================================= */}
        <div 
          className={`absolute top-0 left-1/2 w-1/2 h-full z-50 overflow-hidden transition-transform duration-600 ease-in-out ${
            isSignUpActive ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          {/* Overlay Background Container - Moves opposite to the wrapper to create a static/parallax effect */}
          <div 
            className={`absolute top-0 left-0 w-[200%] h-full bg-gradient-to-br from-primary via-primaryHover to-[#1e3a8a] text-white transition-transform duration-600 ease-in-out ${
              isSignUpActive ? 'translate-x-0' : '-translate-x-1/2'
            }`}
          >
            {/* Background decorative elements for the FinTech feel */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            
            {/* Content for State 2 (Sign Up active -> Overlay is on the Left) */}
            {/* Sits on the left half of the 200% wide container */}
            <div 
              className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center text-center px-12 transition-all duration-500 ease-in-out ${
                isSignUpActive ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <h1 className="text-3xl font-bold mb-4 tracking-tight">{t('auth.welcome_back_title')}</h1>
              <p className="text-sm text-white/80 leading-relaxed mb-8">
                {t('auth.welcome_back_desc')}
              </p>
              <button 
                onClick={() => setIsSignUpActive(false)}
                className="px-8 py-3 rounded-lg border border-white/50 text-white font-bold text-sm tracking-wider uppercase hover:bg-white hover:text-primary transition-colors shadow-lg"
              >
                {t('auth.login_btn')}
              </button>
            </div>

            {/* Content for State 1 (Sign In active -> Overlay is on the Right) */}
            {/* Sits on the right half of the 200% wide container */}
            <div 
              className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center text-center px-12 transition-all duration-500 ease-in-out ${
                !isSignUpActive ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 -translate-y-4 pointer-events-none'
              }`}
            >
              <h1 className="text-3xl font-bold mb-4 tracking-tight">{t('auth.new_trader_title')}</h1>
              <p className="text-sm text-white/80 leading-relaxed mb-8">
                {t('auth.new_trader_desc')}
              </p>
              <button 
                onClick={() => setIsSignUpActive(true)}
                className="px-8 py-3 rounded-lg border border-white/50 text-white font-bold text-sm tracking-wider uppercase hover:bg-white hover:text-primary transition-colors shadow-lg"
              >
                {t('auth.signup_title')}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
