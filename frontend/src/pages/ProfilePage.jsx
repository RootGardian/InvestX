import React, { useState } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Trash2, Globe, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const { user, token, language, currency, updateLanguage, updateCurrency } = useAuth();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: user?.name || user?.email?.split('@')[0] || 'Trader Anonyme',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      setStatus({ type: 'error', message: "Les mots de passe ne correspondent pas." });
      return;
    }

    try {
      if (formData.password) {
        const response = await apiFetch('/api/users/profile', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ newPassword: formData.password })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur réseau');
        }
      }
      setStatus({ type: 'success', message: "Profil mis à jour avec succès." });
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || "Erreur lors de la mise à jour." });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textMain mb-2">Mon Profil</h1>
        <p className="text-textMuted">Gérez vos informations personnelles.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Form Column */}
        <div className="lg:col-span-3 space-y-6 max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8">
            
            {status.message && (
              <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${status.type === 'success' ? 'bg-bullish/10 text-bullish border border-bullish/20' : 'bg-bearish/10 text-bearish border border-bearish/20'}`}>
                {status.message}
              </div>
            )}

            {/* Top Profile Header */}
            <div className="flex justify-between items-center mb-8 border-b border-border/50 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#5e35b1] flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-textMain">{formData.name}</h3>
                  <p className="text-sm text-textMuted">Client InvestX</p>
                </div>
              </div>
              <div className="bg-background border border-border px-3 py-1.5 rounded-lg text-textMuted text-xs font-medium tracking-wider uppercase">
                # IX-{user?.id ? user.id.substring(0, 8) : '00000000'}
              </div>
            </div>

            <form onSubmit={handleSave}>
              {/* Personal Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm text-textMuted mb-2">Nom</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-textMain focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-textMuted mb-2">Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-textMain focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Security */}
              <div className="bg-background border border-border rounded-2xl p-6 mb-8">
                <h4 className="text-sm font-bold text-textMain mb-4">Sécurité</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input 
                      type="password" 
                      placeholder="Nouveau mot de passe"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-card border border-border rounded-xl py-3 px-4 text-sm text-textMain focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <input 
                      type="password" 
                      placeholder="Confirmer"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full bg-card border border-border rounded-xl py-3 px-4 text-sm text-textMain focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-background border border-border rounded-2xl p-6 mb-8">
                <h4 className="text-sm font-bold text-textMain mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Préférences
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-textMuted mb-2">Langue</label>
                    <select 
                      value={language}
                      onChange={(e) => updateLanguage(e.target.value)}
                      className="w-full bg-card border border-border rounded-xl py-3 px-4 text-sm text-textMain focus:outline-none focus:border-primary appearance-none"
                    >
                      <option value="fr">Français (FR)</option>
                      <option value="en">English (EN)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-textMuted mb-2">Devise d'affichage</label>
                    <select 
                      value={currency}
                      onChange={(e) => updateCurrency(e.target.value)}
                      className="w-full bg-card border border-border rounded-xl py-3 px-4 text-sm text-textMain focus:outline-none focus:border-primary appearance-none"
                    >
                      <option value="USD">Dollar Américain (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">Livre Sterling (GBP)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-primary hover:bg-primaryHover text-white font-bold rounded-xl transition-colors">
                Sauvegarder
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
