import React, { useState, useEffect } from 'react';
import { ShoppingCart, TrendingUp, Loader2, CheckCircle2 } from 'lucide-react';
import { useFormatters } from '../hooks/useFormatters';
import { useAuth } from '../contexts/AuthContext';

const ASSETS = [
  { symbol: 'BTC', name: 'Bitcoin', icon: 'B' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'E' },
  { symbol: 'SOL', name: 'Solana', icon: 'S' },
  { symbol: 'AAPL', name: 'Apple Inc.', icon: 'A' },
  { symbol: 'NVDA', name: 'Nvidia Corp.', icon: 'N' }
];

const BuyPage = () => {
  const { formatCurrency } = useFormatters();
  const { user, token, updateProfile } = useAuth();
  
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0].symbol);
  const [quantity, setQuantity] = useState('');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Fetch current price
  useEffect(() => {
    const fetchPrice = async () => {
      setIsLoadingPrice(true);
      try {
        const res = await fetch(`/api/market/quote/${selectedAsset}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setCurrentPrice(data.price || 0);
      } catch (err) {
        console.error("Erreur récupération prix", err);
      } finally {
        setIsLoadingPrice(false);
      }
    };
    fetchPrice();
  }, [selectedAsset, token]);

  const totalCost = currentPrice * (Number(quantity) || 0);
  const canAfford = user?.cashBalance >= totalCost;

  const handleBuy = async () => {
    if (!quantity || Number(quantity) <= 0 || !canAfford) return;
    setIsBuying(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/trading/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ticker: selectedAsset,
          quantity: Number(quantity)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de l'achat");
      }

      // Update cash balance locally
      updateProfile({ cashBalance: user.cashBalance - totalCost });
      setStatus({ type: 'success', message: `Achat de ${quantity} ${selectedAsset} réussi !` });
      setQuantity('');
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsBuying(false);
    }
  };

  const assetDetails = ASSETS.find(a => a.symbol === selectedAsset);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textMain mb-2">Acheter</h1>
        <p className="text-textMuted">Investissez dans le futur.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        
        {/* Left Form */}
        <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold text-textMain mb-6 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" /> Nouvel Ordre d'Achat
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-textMuted mb-2">Choisir un actif</label>
              <select 
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm font-medium text-textMain focus:outline-none focus:border-primary appearance-none"
              >
                {ASSETS.map(asset => (
                  <option key={asset.symbol} value={asset.symbol}>
                    {asset.symbol} - {asset.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-textMuted mb-2">Quantité</label>
              <input 
                type="number" 
                placeholder="Ex: 0.5"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-textMain focus:outline-none focus:border-primary"
              />
            </div>

            <div className="bg-background border border-border rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-textMuted">Coût total :</span>
                <span className="font-bold text-textMain">{formatCurrency(totalCost)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-textMuted">Solde disponible :</span>
                <span className={`font-bold ${canAfford ? 'text-bullish' : 'text-bearish'}`}>
                  {formatCurrency(user?.cashBalance || 0)}
                </span>
              </div>
            </div>

            {status.message && (
              <div className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${status.type === 'success' ? 'bg-bullish/10 text-bullish border border-bullish/20' : 'bg-bearish/10 text-bearish border border-bearish/20'}`}>
                {status.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                {status.message}
              </div>
            )}

            <button 
              onClick={handleBuy}
              disabled={isBuying || !quantity || Number(quantity) <= 0 || !canAfford}
              className="w-full flex items-center justify-center py-4 bg-[#5e35b1] hover:bg-[#512da8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
            >
              {isBuying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmer l'Achat"}
            </button>
          </div>
        </div>

        {/* Right Info */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {assetDetails?.icon}
              </div>
              <div>
                <h4 className="text-lg font-bold text-textMain">{assetDetails?.name} ({assetDetails?.symbol})</h4>
                <div className="flex items-center gap-1 text-sm text-bullish font-medium">
                  {isLoadingPrice ? <Loader2 className="w-3 h-3 animate-spin text-textMuted" /> : <TrendingUp className="w-3 h-3" />}
                  {isLoadingPrice ? '...' : formatCurrency(currentPrice)}
                </div>
              </div>
            </div>
            
            <p className="text-sm text-textMuted leading-relaxed">
              Investissez dans {assetDetails?.name}. Le prix actuel est de {formatCurrency(currentPrice)}. Les transactions sur InvestX sont sécurisées et instantanées grâce à notre moteur de trading haute performance.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BuyPage;
