import React, { useState, useEffect } from 'react';
import { ShoppingCart, Wallet, Loader2, CheckCircle2 } from 'lucide-react';
import { useFormatters } from '../hooks/useFormatters';
import { useAuth } from '../contexts/AuthContext';

const SellPage = () => {
  const { formatCurrency } = useFormatters();
  const { user, token, updateProfile } = useAuth();
  
  const [portfolioAssets, setPortfolioAssets] = useState([]);
  const [selectedAssetTicker, setSelectedAssetTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(true);
  const [isSelling, setIsSelling] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Fetch portfolio
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch('/api/dashboard/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setPortfolioAssets(data.assets || []);
        if (data.assets?.length > 0) {
          setSelectedAssetTicker(data.assets[0].ticker);
        }
      } catch (err) {
        console.error("Erreur récupération portfolio", err);
      } finally {
        setIsLoadingPortfolio(false);
      }
    };
    fetchPortfolio();
  }, [token]);

  const selectedAsset = portfolioAssets.find(a => a.ticker === selectedAssetTicker);
  const maxQuantity = selectedAsset ? Number(selectedAsset.quantity) : 0;
  const currentPrice = selectedAsset ? selectedAsset.currentPrice : 0;
  const totalReceive = currentPrice * (Number(quantity) || 0);

  const handleSell = async () => {
    if (!quantity || Number(quantity) <= 0 || Number(quantity) > maxQuantity) return;
    setIsSelling(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/trading/sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ticker: selectedAssetTicker,
          quantity: Number(quantity)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la vente");
      }

      // Update cash balance locally
      updateProfile({ cashBalance: user.cashBalance + totalReceive });
      
      // Update local portfolio state to reflect sold quantity
      setPortfolioAssets(prev => prev.map(a => {
        if (a.ticker === selectedAssetTicker) {
          return { ...a, quantity: Number(a.quantity) - Number(quantity) };
        }
        return a;
      }).filter(a => a.quantity > 0));

      setStatus({ type: 'success', message: `Vente de ${quantity} ${selectedAssetTicker} réussie !` });
      setQuantity('');
      
      // If sold out, select another asset if available
      if (Number(quantity) === maxQuantity) {
        const remaining = portfolioAssets.filter(a => a.ticker !== selectedAssetTicker);
        if (remaining.length > 0) setSelectedAssetTicker(remaining[0].ticker);
        else setSelectedAssetTicker('');
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsSelling(false);
    }
  };
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textMain mb-2">Vendre</h1>
        <p className="text-textMuted">Liquidez vos positions.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        
        {/* Left Form */}
        <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold text-textMain mb-6 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-bearish" /> Nouvel Ordre de Vente
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-textMuted mb-2">Choisir un actif détenu</label>
              {isLoadingPortfolio ? (
                <div className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-textMuted flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Chargement du portefeuille...
                </div>
              ) : portfolioAssets.length === 0 ? (
                <div className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-bearish">
                  Vous ne possédez aucun actif à vendre.
                </div>
              ) : (
                <select 
                  value={selectedAssetTicker}
                  onChange={(e) => {
                    setSelectedAssetTicker(e.target.value);
                    setQuantity('');
                  }}
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm font-medium text-textMain focus:outline-none focus:border-bearish appearance-none"
                >
                  {portfolioAssets.map(asset => (
                    <option key={asset.ticker} value={asset.ticker}>
                      {asset.ticker} ({Number(asset.quantity).toFixed(4)} possédés)
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm text-textMuted mb-2">Quantité à vendre</label>
              <input 
                type="number" 
                placeholder="Ex: 0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={!selectedAssetTicker}
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-textMain focus:outline-none focus:border-bearish disabled:opacity-50"
              />
            </div>

            <div className="bg-background border border-border rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-textMuted">Vous recevrez :</span>
                <span className="font-bold text-bullish">+{formatCurrency(totalReceive)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-textMuted">Quantité maximum :</span>
                <span className="font-bold text-textMain">{maxQuantity.toFixed(4)} {selectedAssetTicker}</span>
              </div>
            </div>

            {status.message && (
              <div className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${status.type === 'success' ? 'bg-bullish/10 text-bullish border border-bullish/20' : 'bg-bearish/10 text-bearish border border-bearish/20'}`}>
                {status.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                {status.message}
              </div>
            )}

            <button 
              onClick={handleSell}
              disabled={isSelling || !quantity || Number(quantity) <= 0 || Number(quantity) > maxQuantity}
              className="w-full py-4 flex items-center justify-center bg-[#c84444] hover:bg-[#b03c3c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
            >
              {isSelling ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmer la Vente"}
            </button>
          </div>
        </div>

        {/* Right Info */}
        <div className="lg:col-span-2">
          {selectedAsset ? (
            <>
              <div className="bg-card border border-border rounded-2xl p-6 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {selectedAsset.ticker.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-textMain">{maxQuantity.toFixed(4)} {selectedAsset.ticker}</h4>
                    <div className="text-sm text-textMuted">
                      Prix actuel : {formatCurrency(currentPrice)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-2xl p-4">
                  <div className="text-xs text-textMuted mb-1">Prix moyen</div>
                  <div className="font-bold text-textMain">{formatCurrency(selectedAsset.averageBuyPrice)}</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-4">
                  <div className="text-xs text-textMuted mb-1">P&L Profil</div>
                  <div className={`font-bold ${Number(selectedAsset.performancePercentage) >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                    {Number(selectedAsset.performancePercentage) >= 0 ? '+' : ''}{selectedAsset.performancePercentage}%
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center text-textMuted">
              <Wallet className="w-12 h-12 mb-4 opacity-20" />
              <p>Sélectionnez un actif dans la liste pour voir les détails de votre position.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SellPage;
