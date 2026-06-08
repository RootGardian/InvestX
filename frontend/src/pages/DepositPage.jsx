import React, { useState } from 'react';
import { apiFetch } from '../utils/api';
import { ShieldCheck, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DepositPage = () => {
  const [amount, setAmount] = useState('100.00');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const { token, updateProfile, user } = useAuth();

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) return;
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await apiFetch('/api/users/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: Number(amount) })
      });

      if (!res.ok) {
        throw new Error('Erreur lors du dépôt');
      }

      const data = await res.json();
      updateProfile({ cashBalance: data.cashBalance });
      setStatus({ type: 'success', message: `Dépôt de $${amount} réussi !` });
      setAmount('100.00');
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textMain mb-2">Déposer</h1>
        <p className="text-textMuted">Alimentez votre compte InvestX de manière sécurisée.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Left Card: SSL info */}
        <div className="bg-card border border-border rounded-2xl p-6 h-fit">
          <h3 className="text-lg font-bold text-textMain mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-bullish" /> Protection SSL
          </h3>
          <p className="text-sm text-textMuted mb-6 leading-relaxed">
            InvestX utilise la technologie Stripe pour garantir que vos informations financières ne sont jamais stockées sur nos serveurs.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-textMuted">
              <ShieldCheck className="w-4 h-4 text-bullish" /> Cryptage de bout en bout
            </div>
            <div className="flex items-center gap-2 text-sm text-textMuted">
              <ShieldCheck className="w-4 h-4 text-bullish" /> Conformité PCI-DSS
            </div>
            <div className="flex items-center gap-2 text-sm text-textMuted">
              <ShieldCheck className="w-4 h-4 text-bullish" /> Confirmation par Webhook
            </div>
          </div>
        </div>

        {/* Right Card: Deposit Form */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <label className="block text-sm font-medium text-textMuted mb-4">Montant à déposer ($)</label>
          
          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-xl">$</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-background border border-border rounded-xl py-4 pl-10 pr-4 text-2xl font-bold text-textMain focus:outline-none focus:border-primary transition-colors"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
              <button className="w-4 h-4 bg-border rounded-sm flex items-center justify-center text-textMuted hover:bg-primary/20 hover:text-primary">▲</button>
              <button className="w-4 h-4 bg-border rounded-sm flex items-center justify-center text-textMuted hover:bg-primary/20 hover:text-primary">▼</button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {['100', '500', '1000'].map(val => (
              <button 
                key={val}
                onClick={() => setAmount(`${val}.00`)}
                className="py-3 bg-background border border-border rounded-lg text-sm font-bold text-textMain hover:border-primary/50 transition-colors"
              >
                ${val}
              </button>
            ))}
          </div>

          {status.message && (
            <div className={`p-4 rounded-lg mb-6 text-sm font-medium flex items-center gap-2 ${status.type === 'success' ? 'bg-bullish/10 text-bullish border border-bullish/20' : 'bg-bearish/10 text-bearish border border-bearish/20'}`}>
              {status.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {status.message}
            </div>
          )}

          <button 
            onClick={handleDeposit}
            disabled={isLoading || !amount || Number(amount) <= 0}
            className="w-full flex items-center justify-center gap-2 bg-[#5e35b1] hover:bg-[#512da8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 rounded-xl transition-colors"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Confirmer le dépôt <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DepositPage;
