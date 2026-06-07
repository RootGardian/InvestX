import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Search, ArrowRightLeft } from 'lucide-react';
import { createChart, ColorType } from 'lightweight-charts';
import { useFormatters } from '../hooks/useFormatters';

const initialData = [
  { time: '2023-01-01', open: 150.1, high: 155.5, low: 148.2, close: 152.3 },
  { time: '2023-01-02', open: 152.3, high: 156.0, low: 151.1, close: 155.0 },
  { time: '2023-01-03', open: 155.0, high: 158.2, low: 154.5, close: 156.7 },
  { time: '2023-01-04', open: 156.7, high: 157.0, low: 153.2, close: 154.1 },
  { time: '2023-01-05', open: 154.1, high: 160.5, low: 153.8, close: 159.2 },
  { time: '2023-01-06', open: 159.2, high: 162.0, low: 158.0, close: 161.5 },
  { time: '2023-01-07', open: 161.5, high: 165.2, low: 160.1, close: 164.8 },
  { time: '2023-01-08', open: 164.8, high: 166.0, low: 162.5, close: 163.2 },
  { time: '2023-01-09', open: 163.2, high: 168.5, low: 162.0, close: 167.9 },
  { time: '2023-01-10', open: 167.9, high: 172.0, low: 167.1, close: 171.5 },
];

const MarketsPage = () => {
  const chartContainerRef = useRef(null);
  const { formatCurrency, t } = useFormatters();
  const [selectedAsset, setSelectedAsset] = useState('AAPL');

  const markets = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 171.50, change: '+2.1%', isUp: true },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 175.34, change: '-3.1%', isUp: false },
    { symbol: 'BTC/USD', name: 'Bitcoin', price: 64230.50, change: '+2.4%', isUp: true },
    { symbol: 'ETH/USD', name: 'Ethereum', price: 3450.00, change: '-1.2%', isUp: false },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 890.12, change: '+5.6%', isUp: true },
  ];

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#151A22' }, // bg-card
        textColor: '#9ca3af', // textMuted
      },
      grid: {
        vertLines: { color: '#2d3748' },
        horzLines: { color: '#2d3748' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        borderColor: '#2d3748',
      },
      rightPriceScale: {
        borderColor: '#2d3748',
      },
      crosshair: {
        vertLine: { color: '#3B82F6', width: 1, style: 1 },
        horzLine: { color: '#3B82F6', width: 1, style: 1 },
      }
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10B981', // bullish
      downColor: '#EF4444', // bearish
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    });

    candlestickSeries.setData(initialData);

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [selectedAsset]);

  const activeMarket = markets.find(m => m.symbol === selectedAsset) || markets[0];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full pb-10">
      
      {/* Left Sidebar: Assets List */}
      <div className="w-full lg:w-1/4 bg-card border border-border rounded-xl p-4 flex flex-col h-[800px] lg:h-auto overflow-hidden">
        <h2 className="text-xl font-bold text-textMain mb-4">{t('markets_title')}</h2>
        
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-textMuted" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-textMain text-sm focus:outline-none focus:border-primary" 
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
          {markets.map((market) => (
            <button 
              key={market.symbol}
              onClick={() => setSelectedAsset(market.symbol)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors border ${
                selectedAsset === market.symbol 
                  ? 'bg-primary/10 border-primary text-textMain' 
                  : 'bg-background border-transparent hover:border-border text-textMuted hover:text-textMain'
              }`}
            >
              <div className="text-left">
                <div className="font-bold">{market.symbol}</div>
                <div className="text-xs opacity-70">{market.name}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-textMain">{formatCurrency(market.price)}</div>
                <div className={`text-xs font-medium flex items-center justify-end gap-1 ${market.isUp ? 'text-bullish' : 'text-bearish'}`}>
                  {market.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {market.change}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Trading Area */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Chart Header */}
        <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-textMain">{activeMarket.symbol}</h1>
              <span className="text-textMuted text-sm">{activeMarket.name}</span>
            </div>
            <div className="h-8 w-px bg-border mx-2"></div>
            <div>
              <div className="text-xl font-bold text-textMain">{formatCurrency(activeMarket.price)}</div>
              <div className={`text-sm font-medium flex items-center gap-1 ${activeMarket.isUp ? 'text-bullish' : 'text-bearish'}`}>
                {activeMarket.change}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-background border border-border rounded text-sm text-textMuted hover:text-textMain">1H</button>
            <button className="px-3 py-1 bg-primary/20 border border-primary rounded text-sm text-primary font-medium">1D</button>
            <button className="px-3 py-1 bg-background border border-border rounded text-sm text-textMuted hover:text-textMain">1W</button>
          </div>
        </div>

        {/* Lightweight Chart Container */}
        <div className="bg-card border border-border rounded-xl p-4 flex-1 min-h-[400px]">
          <div ref={chartContainerRef} className="w-full h-full" />
        </div>

        {/* Order Panel */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold text-textMain mb-4 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-primary" /> {t('execute_order')}
          </h3>
          
          <div className="flex gap-4 mb-6">
            <button className="flex-1 py-3 bg-bullish text-white font-bold rounded-lg uppercase tracking-wider hover:opacity-90 transition-opacity">
              {t('buy')}
            </button>
            <button className="flex-1 py-3 bg-background border border-border text-bearish font-bold rounded-lg uppercase tracking-wider hover:bg-bearish/10 hover:border-bearish/50 transition-all">
              {t('sell')}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-2">Type d'ordre</label>
              <select className="w-full bg-background border border-border px-4 py-3 rounded-lg text-textMain focus:outline-none focus:border-primary">
                <option>Au marché (Market)</option>
                <option>Limite (Limit)</option>
                <option>Stop Loss</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-2">{t('amount')} ({activeMarket.symbol})</label>
              <input 
                type="number" 
                placeholder="0.00" 
                className="w-full bg-background border border-border px-4 py-3 rounded-lg text-textMain focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketsPage;
