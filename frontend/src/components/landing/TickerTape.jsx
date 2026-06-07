import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TICKERS = [
  { symbol: 'BTC/USD', price: '64,230.50', change: '+2.4%', isUp: true },
  { symbol: 'ETH/USD', price: '3,450.00', change: '-1.2%', isUp: false },
  { symbol: 'AAPL', price: '189.45', change: '+0.8%', isUp: true },
  { symbol: 'NVDA', price: '890.12', change: '+5.6%', isUp: true },
  { symbol: 'TSLA', price: '175.34', change: '-3.1%', isUp: false },
  { symbol: 'EUR/USD', price: '1.0850', change: '+0.1%', isUp: true },
  { symbol: 'GOLD', price: '2,340.80', change: '+1.5%', isUp: true },
];

const TickerItem = ({ symbol, price, change, isUp }) => (
  <div className="flex items-center space-x-3 whitespace-nowrap px-8 border-r border-border/50 text-sm font-medium">
    <span className="text-textMuted">{symbol}</span>
    <span className="text-textMain">{price}</span>
    <span className={`flex items-center ${isUp ? 'text-bullish' : 'text-bearish'}`}>
      {isUp ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
      {change}
    </span>
  </div>
);

const TickerTape = () => {
  return (
    <div className="w-full bg-card border-b border-border overflow-hidden py-2 relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-card to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-card to-transparent z-10"></div>
      
      <div className="flex w-[200%] animate-ticker">
        {/* Double the array to create infinite scrolling effect */}
        {[...TICKERS, ...TICKERS].map((ticker, index) => (
          <TickerItem key={index} {...ticker} />
        ))}
      </div>
    </div>
  );
};

export default TickerTape;
