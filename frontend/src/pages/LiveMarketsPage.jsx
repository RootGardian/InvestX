import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { Search, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useFormatters } from '../hooks/useFormatters';
import { useAuth } from '../contexts/AuthContext';
import TradingChart from '../components/dashboard/TradingChart';

const ASSETS = [
  { name: 'Bitcoin', ticker: 'BTC', icon: 'B' },
  { name: 'Ethereum', ticker: 'ETH', icon: 'E' },
  { name: 'Solana', ticker: 'SOL', icon: 'S' },
  { name: 'Apple Inc.', ticker: 'AAPL', icon: 'A' },
  { name: 'Nvidia Corp.', ticker: 'NVDA', icon: 'N' },
];

const LiveMarketsPage = () => {
  const { formatCurrency } = useFormatters();
  const { token } = useAuth();
  
  const [marketData, setMarketData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTicker, setSelectedTicker] = useState('BTC');

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const tickers = ASSETS.map(a => a.ticker).join(',');
        const res = await apiFetch(`/api/market/quotes-batch?tickers=${tickers}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        // Merge with static asset info
        const mergedData = data.map(quote => {
          const assetInfo = ASSETS.find(a => a.ticker === quote.ticker);
          return {
            ...assetInfo,
            price: quote.price,
            change: quote.changePercent ? (quote.changePercent > 0 ? '+' : '') + quote.changePercent.toFixed(2) + '%' : '0.00%',
            isUp: quote.changePercent >= 0
          };
        });
        
        setMarketData(mergedData);
      } catch (err) {
        console.error("Erreur récupération marchés", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarkets();
    const interval = setInterval(fetchMarkets, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [token]);

  const filteredData = marketData.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.ticker.toLowerCase().includes(search.toLowerCase())
  );

  // Top PUMP and DUMP
  const sortedByChange = [...marketData].sort((a, b) => parseFloat(b.change) - parseFloat(a.change));
  const topPump = sortedByChange.slice(0, 3);
  const topDump = [...marketData].sort((a, b) => parseFloat(a.change) - parseFloat(b.change)).slice(0, 3);

  const selectedAssetInfo = marketData.find(m => m.ticker === selectedTicker);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textMain mb-2">Marché en Direct</h1>
        <p className="text-textMuted">Explorez les opportunités et analysez les graphiques.</p>
      </div>

      {/* Chart Section */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-textMain">{selectedTicker}/USD</h2>
            {selectedAssetInfo && (
              <div className="flex items-center gap-3">
                <span className="text-xl font-medium text-textMain">{formatCurrency(selectedAssetInfo.price)}</span>
                <span className={`text-sm font-medium flex items-center px-2 py-1 rounded-md ${selectedAssetInfo.isUp ? 'bg-bullish/10 text-bullish' : 'bg-bearish/10 text-bearish'}`}>
                  {selectedAssetInfo.isUp ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {selectedAssetInfo.change}
                </span>
              </div>
            )}
          </div>
        </div>
        <TradingChart ticker={selectedTicker} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-textMain">Actifs Disponibles</h3>
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-border rounded-lg py-2 pl-9 pr-4 text-sm text-textMain focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-textMuted text-sm">
                  <th className="pb-4 font-medium">Nom</th>
                  <th className="pb-4 font-medium">Ticker</th>
                  <th className="pb-4 font-medium">Prix</th>
                  <th className="pb-4 font-medium">24h %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-textMuted">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Chargement des données du marché...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-textMuted">
                      Aucun actif trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((market, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => setSelectedTicker(market.ticker)}
                      className={`cursor-pointer transition-colors ${selectedTicker === market.ticker ? 'bg-primary/10 hover:bg-primary/20' : 'hover:bg-background/50'}`}
                    >
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-xs font-bold text-textMuted">
                            {market.icon}
                          </div>
                          <span className="font-bold text-textMain">{market.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-textMuted">{market.ticker}</td>
                      <td className="py-4 font-bold text-textMain">{formatCurrency(market.price)}</td>
                      <td className={`py-4 font-medium ${market.isUp ? 'text-bullish' : 'text-bearish'}`}>
                        <div className="flex items-center gap-1">
                          {market.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {market.change}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Top PUMP */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-textMain mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-bullish" /> Top PUMP
            </h3>
            <div className="space-y-3">
              {isLoading ? (
                 <div className="text-center text-sm text-textMuted py-4">Chargement...</div>
              ) : topPump.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedTicker(item.ticker)}
                  className="flex justify-between items-center bg-background rounded-lg p-4 border border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <span className="font-bold text-textMain">{item.ticker}</span>
                  <span className="font-medium text-bullish">{item.change}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top DUMP */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-textMain mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-bearish" /> Top DUMP
            </h3>
            <div className="space-y-3">
              {isLoading ? (
                 <div className="text-center text-sm text-textMuted py-4">Chargement...</div>
              ) : topDump.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedTicker(item.ticker)}
                  className="flex justify-between items-center bg-background rounded-lg p-4 border border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <span className="font-bold text-textMain">{item.ticker}</span>
                  <span className="font-medium text-bearish">{item.change}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LiveMarketsPage;
