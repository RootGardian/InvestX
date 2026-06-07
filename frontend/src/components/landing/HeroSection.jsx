import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../utils/currency';

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 pb-32">
      {/* Background glowing gradients */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full bg-bullish/10 blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              {t('landing.hero_badge')}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-textMain mb-6 leading-tight">
              {t('landing.hero_title_1')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-bullish">{t('landing.hero_title_highlight')}</span>.
            </h1>
            
            <p className="text-lg text-textMuted mb-8 leading-relaxed max-w-xl">
              {t('landing.hero_subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primaryHover transition-all hover:scale-105 active:scale-95">
                {t('landing.start_trading')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-card border border-border px-8 py-4 text-base font-semibold text-textMain hover:bg-border transition-colors">
                {t('landing.discover_platform')}
              </button>
            </div>

            <div className="mt-8 flex items-center gap-4 text-sm text-textMuted">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-bullish" />
                <span>{t('landing.feature_fast')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>{t('landing.feature_realtime')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Illustration / Dashboard Preview */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative rounded-2xl bg-card border border-border shadow-2xl p-6 overflow-hidden">
              {/* Header of fake dashboard */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-border/50">
                <div>
                  <h3 className="text-textMuted text-sm font-medium">{t('landing.mock_balance_title')}</h3>
                  <div className="text-3xl font-bold text-textMain mt-1">{formatCurrency(124530.80, 'USD')}</div>
                  <div className="text-bullish text-sm font-semibold flex items-center mt-1">
                    <ArrowUpRight className="w-4 h-4 mr-1" /> +24.53% ({formatCurrency(24530.80, 'USD')})
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-bullish"></div>
              </div>

              {/* Fake Candlestick Chart SVG */}
              <div className="h-48 w-full flex items-end justify-between gap-2 mt-8">
                {/* Simplified visual representation of candlesticks */}
                {[
                  { h: 30, up: false }, { h: 45, up: true }, { h: 60, up: true },
                  { h: 40, up: false }, { h: 70, up: true }, { h: 85, up: true },
                  { h: 65, up: false }, { h: 90, up: true }, { h: 100, up: true }
                ].map((stick, i) => (
                  <div key={i} className="flex flex-col items-center justify-end w-full group cursor-crosshair">
                    <div className={`w-0.5 h-full opacity-50 ${stick.up ? 'bg-bullish' : 'bg-bearish'}`}></div>
                    <div 
                      className={`w-full rounded-sm transition-all duration-300 group-hover:opacity-80 ${stick.up ? 'bg-bullish' : 'bg-bearish'}`} 
                      style={{ height: `${stick.h}%`, marginTop: '-100%' }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-background border border-border rounded-xl p-4 shadow-xl flex items-center gap-4 animate-bounce" style={{animationDuration: '3s'}}>
              <div className="bg-bullish/10 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-bullish" />
              </div>
              <div>
                <p className="text-xs text-textMuted font-medium">{t('landing.mock_market_status')}</p>
                <p className="text-sm font-bold text-bullish">{t('landing.mock_trend_up')}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// Extracted here since we use it in the hero visual
const ArrowUpRight = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 7h10v10"></path>
    <path d="M7 17 17 7"></path>
  </svg>
);

export default HeroSection;
