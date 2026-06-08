import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useFormatters } from '../hooks/useFormatters';
import { Bell, BellRing, Trash2, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

const ASSETS = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'NVDA', name: 'Nvidia Corp.' }
];

const PriceAlertsPage = () => {
  const { token } = useAuth();
  const { formatCurrency } = useFormatters();

  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [ticker, setTicker] = useState('BTC');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState('ABOVE');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch('/api/alerts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAlerts(data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [token]);

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    if (!targetPrice || Number(targetPrice) <= 0) {
      setStatusMsg({ type: 'error', text: 'Veuillez entrer un prix valide.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await apiFetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ticker,
          targetPrice: Number(targetPrice),
          condition
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la création de l'alerte");

      setStatusMsg({ type: 'success', text: 'Alerte créée avec succès !' });
      setTargetPrice('');
      fetchAlerts();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAlert = async (id) => {
    try {
      const res = await apiFetch(`/api/alerts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchAlerts();
    } catch (err) {
      console.error("Error deleting alert:", err);
    }
  };

  const toggleAlertStatus = async (id, currentStatus) => {
    try {
      const res = await apiFetch(`/api/alerts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) fetchAlerts();
    } catch (err) {
      console.error("Error toggling alert:", err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-textMain mb-2">Alertes de Prix</h1>
        <p className="text-textMuted">Soyez notifié quand un actif atteint le prix que vous visez.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Create Form */}
        <div className="md:col-span-1 bg-card border border-border rounded-2xl p-6 h-fit shadow-lg shadow-background/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <BellRing className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-textMain">Nouvelle Alerte</h2>
          </div>

          <form onSubmit={handleCreateAlert} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-textMuted mb-1.5 uppercase tracking-wider">Actif</label>
              <select 
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-textMain focus:outline-none focus:border-primary appearance-none font-medium"
              >
                {ASSETS.map(a => <option key={a.symbol} value={a.symbol}>{a.symbol} - {a.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-textMuted mb-1.5 uppercase tracking-wider">Condition</label>
              <div className="flex bg-background border border-border rounded-xl p-1">
                <button 
                  type="button"
                  onClick={() => setCondition('ABOVE')}
                  className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all ${condition === 'ABOVE' ? 'bg-bullish text-white shadow-md' : 'text-textMuted hover:text-textMain'}`}
                >
                  <TrendingUp className="w-4 h-4" /> Supérieur à
                </button>
                <button 
                  type="button"
                  onClick={() => setCondition('BELOW')}
                  className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all ${condition === 'BELOW' ? 'bg-bearish text-white shadow-md' : 'text-textMuted hover:text-textMain'}`}
                >
                  <TrendingDown className="w-4 h-4" /> Inférieur à
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-textMuted mb-1.5 uppercase tracking-wider">Prix Cible (USD)</label>
              <input 
                type="number" 
                step="any"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-textMain focus:outline-none focus:border-primary"
                placeholder="Ex: 65000"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex justify-center items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Créer l\'alerte'}
            </button>

            {statusMsg.text && (
              <div className={`p-3 rounded-xl text-sm text-center font-medium ${statusMsg.type === 'success' ? 'bg-bullish/10 text-bullish border border-bullish/20' : 'bg-bearish/10 text-bearish border border-bearish/20'}`}>
                {statusMsg.text}
              </div>
            )}
          </form>
        </div>

        {/* Alerts List */}
        <div className="md:col-span-2">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg shadow-background/50 h-full flex flex-col">
            <div className="p-6 border-b border-border flex justify-between items-center bg-card z-10">
              <h2 className="text-lg font-bold text-textMain">Vos Alertes</h2>
              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
                {alerts.length} Active{alerts.length !== 1 && 's'}
              </span>
            </div>

            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-textMuted">
                  <Bell className="w-12 h-12 mb-3 opacity-20" />
                  <p>Aucune alerte configurée.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map(alert => (
                    <div key={alert.id} className={`flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl border transition-all ${alert.isActive ? 'bg-background border-border hover:border-primary/50' : 'bg-background/50 border-border/50 opacity-60'}`}>
                      <div className="flex items-center gap-4 mb-3 sm:mb-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border ${alert.condition === 'ABOVE' ? 'bg-bullish/10 text-bullish border-bullish/20' : 'bg-bearish/10 text-bearish border-bearish/20'}`}>
                          {alert.ticker}
                        </div>
                        <div>
                          <p className="text-sm text-textMuted flex items-center gap-1">
                            Condition : {alert.condition === 'ABOVE' ? <><TrendingUp className="w-3 h-3 text-bullish" /> Supérieur à</> : <><TrendingDown className="w-3 h-3 text-bearish" /> Inférieur à</>}
                          </p>
                          <p className="text-xl font-bold text-textMain">
                            {formatCurrency(alert.targetPrice)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleAlertStatus(alert.id, alert.isActive)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${alert.isActive ? 'bg-card border border-border text-textMain hover:bg-border/50' : 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'}`}
                        >
                          {alert.isActive ? 'Désactiver' : 'Réactiver'}
                        </button>
                        <button 
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="p-2 bg-bearish/10 text-bearish hover:bg-bearish hover:text-white rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceAlertsPage;
