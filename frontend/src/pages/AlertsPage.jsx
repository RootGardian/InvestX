import React, { useState, useEffect } from 'react';
import { ArrowDownRight, ArrowUpRight, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFormatters } from '../hooks/useFormatters';

const ASSETS = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'NVDA', name: 'Nvidia Corp.' }
];

const AlertsPage = () => {
  const { token, user } = useAuth();
  const { formatCurrency } = useFormatters();
  
  const [ticker, setTicker] = useState('BTC');
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [myOrders, setMyOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Order Form
  const [side, setSide] = useState('BUY');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [obRes, moRes] = await Promise.all([
        fetch(`/api/orderbook/${ticker}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/orderbook/my-orders', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const obData = await obRes.json();
      const moData = await moRes.json();
      
      setOrderBook(obData);
      setMyOrders(moData);
    } catch (err) {
      console.error("Erreur récupération orderbook", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [ticker, token]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!price || !quantity || Number(price) <= 0 || Number(quantity) <= 0) {
      setStatus({ type: 'error', message: "Prix et quantité invalides" });
      return;
    }
    
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });
    
    try {
      const res = await fetch('/api/orderbook/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ticker,
          side,
          price: Number(price),
          quantity: Number(quantity)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la création de l'ordre");

      setStatus({ type: 'success', message: data.message });
      setPrice('');
      setQuantity('');
      fetchData(); // Refresh list
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await fetch(`/api/orderbook/orders/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error("Erreur lors de l'annulation", err);
    }
  };

  // Group bids and asks for display
  const renderBookList = (orders, type) => {
    if (!orders || orders.length === 0) {
      return <div className="text-center text-textMuted text-sm py-4">Carnet vide</div>;
    }
    
    return orders.slice(0, 10).map((o, i) => (
      <div key={i} className="flex justify-between items-center py-1 text-sm">
        <span className="text-textMuted">{Number(o.quantity).toFixed(4)}</span>
        <span className={`font-bold ${type === 'bid' ? 'text-bullish' : 'text-bearish'}`}>
          {formatCurrency(o.price)}
        </span>
      </div>
    ));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-textMain mb-2">Trading P2P</h1>
          <p className="text-textMuted">Carnet d'ordres et échanges directs entre utilisateurs.</p>
        </div>
        <div className="flex gap-4">
          <select 
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="bg-card border border-border rounded-xl py-2 px-4 text-sm font-bold text-textMain focus:outline-none focus:border-primary appearance-none"
          >
            {ASSETS.map(a => <option key={a.symbol} value={a.symbol}>{a.symbol} - {a.name}</option>)}
          </select>
          <button onClick={fetchData} className="p-2 bg-card border border-border rounded-xl hover:bg-background transition-colors text-textMuted hover:text-textMain">
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Place Order Form */}
        <div className="bg-card border border-border rounded-2xl p-6 lg:col-span-1 h-fit">
          <h3 className="text-lg font-bold text-textMain mb-6">Placer un ordre</h3>
          
          <div className="flex bg-background border border-border rounded-xl p-1 mb-6">
            <button 
              onClick={() => setSide('BUY')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${side === 'BUY' ? 'bg-bullish text-white shadow-md' : 'text-textMuted hover:text-textMain'}`}
            >
              Acheter
            </button>
            <button 
              onClick={() => setSide('SELL')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${side === 'SELL' ? 'bg-bearish text-white shadow-md' : 'text-textMuted hover:text-textMain'}`}
            >
              Vendre
            </button>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="block text-xs text-textMuted mb-1">Prix Limite ({ticker})</label>
              <input 
                type="number" 
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-textMain focus:outline-none focus:border-primary"
                placeholder="Ex: 65000"
              />
            </div>
            <div>
              <label className="block text-xs text-textMuted mb-1">Quantité</label>
              <input 
                type="number" 
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-textMain focus:outline-none focus:border-primary"
                placeholder="Ex: 0.1"
              />
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between text-sm mb-4">
                <span className="text-textMuted">Total</span>
                <span className="font-bold text-textMain">
                  {formatCurrency((Number(price) || 0) * (Number(quantity) || 0))}
                </span>
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 font-bold rounded-xl transition-colors text-white flex items-center justify-center ${side === 'BUY' ? 'bg-bullish hover:bg-bullish/80' : 'bg-bearish hover:bg-bearish/80'} disabled:opacity-50`}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : `${side === 'BUY' ? 'Acheter' : 'Vendre'} ${ticker}`}
              </button>
            </div>
            
            {status.message && (
              <div className={`p-3 rounded-lg text-xs font-medium mt-4 ${status.type === 'success' ? 'bg-bullish/10 text-bullish' : 'bg-bearish/10 text-bearish'}`}>
                {status.message}
              </div>
            )}
          </form>
        </div>

        {/* Order Book */}
        <div className="bg-card border border-border rounded-2xl p-6 lg:col-span-1 h-fit">
          <h3 className="text-lg font-bold text-textMain mb-6">Carnet d'ordres</h3>
          <div className="flex justify-between text-xs text-textMuted border-b border-border pb-2 mb-2">
            <span>Quantité ({ticker})</span>
            <span>Prix (USD)</span>
          </div>
          
          <div className="space-y-4">
            {/* Asks (Sells) - Displayed from highest to lowest price at the top, or lowest ask at bottom. Standard orderbook has lowest ask near the spread */}
            <div className="flex flex-col-reverse space-y-reverse space-y-1">
              {renderBookList(orderBook.asks, 'ask')}
            </div>
            
            <div className="py-2 flex items-center justify-center border-y border-border/50 text-textMuted text-xs">
              Spreed du marché
            </div>

            {/* Bids (Buys) */}
            <div className="space-y-1">
              {renderBookList(orderBook.bids, 'bid')}
            </div>
          </div>
        </div>

        {/* My Orders */}
        <div className="bg-card border border-border rounded-2xl p-6 lg:col-span-1">
          <h3 className="text-lg font-bold text-textMain mb-6">Mes Ordres Actifs</h3>
          <div className="space-y-3 h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {myOrders.filter(o => o.status === 'OPEN').length === 0 ? (
              <div className="text-center text-textMuted text-sm py-8">
                Aucun ordre en cours.
              </div>
            ) : (
              myOrders.filter(o => o.status === 'OPEN').map(order => (
                <div key={order.id} className="p-3 bg-background border border-border rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${order.side === 'BUY' ? 'bg-bullish/10 text-bullish' : 'bg-bearish/10 text-bearish'}`}>
                        {order.side === 'BUY' ? 'ACHAT' : 'VENTE'}
                      </span>
                      <span className="font-bold text-sm text-textMain">{order.ticker}</span>
                    </div>
                    <button onClick={() => handleCancel(order.id)} className="text-textMuted hover:text-bearish transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-textMuted">Prix</span>
                    <span className="font-medium text-textMain">{formatCurrency(order.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-textMuted">Quantité</span>
                    <span className="font-medium text-textMain">{order.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1 border-t border-border/50 pt-1">
                    <span className="text-textMuted">Rempli</span>
                    <span className="font-medium text-primary">{(Number(order.quantity) - Number(order.remaining)).toFixed(4)} / {order.quantity}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AlertsPage;
