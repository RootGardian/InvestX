import React from 'react';
import { Check } from 'lucide-react';

const PricingPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex-grow">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-textMain mb-4">Des tarifs transparents pour tous</h1>
        <p className="text-textMuted text-lg">InvestX est gratuit pour la simulation, avec des fonctionnalités pro pour les traders avancés.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Tier 1 */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <h3 className="text-xl font-bold text-textMain mb-2">Simulateur</h3>
          <div className="text-3xl font-bold text-textMain mb-6">0 $ <span className="text-base font-normal text-textMuted">/mois</span></div>
          <p className="text-textMuted mb-6">Parfait pour apprendre sans risquer son capital.</p>
          <button className="w-full py-3 rounded-lg border border-border hover:bg-border transition-colors font-semibold mb-8">Créer un compte</button>
          <ul className="space-y-3">
            {['Portefeuille virtuel de 100k$', 'Données de marché différées (15min)', 'Passage d\'ordres basique', 'Analyse NLP limitée (5/jour)'].map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-textMuted">
                <Check className="w-4 h-4 text-primary" /> {feat}
              </li>
            ))}
          </ul>
        </div>

        {/* Tier 2 */}
        <div className="bg-card border border-primary rounded-2xl p-8 relative transform md:-translate-y-4 shadow-2xl shadow-primary/10">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">POPULAIRE</div>
          <h3 className="text-xl font-bold text-textMain mb-2">Trader Pro</h3>
          <div className="text-3xl font-bold text-textMain mb-6">15 $ <span className="text-base font-normal text-textMuted">/mois</span></div>
          <p className="text-textMuted mb-6">Pour les traders actifs qui veulent des outils sérieux.</p>
          <button className="w-full py-3 rounded-lg bg-primary hover:bg-primaryHover text-white transition-colors font-semibold mb-8">Essai gratuit 14 jours</button>
          <ul className="space-y-3">
            {['Tout du mode Simulateur', 'Données de marché en temps réel', 'Carnet d\'ordres de niveau 2', 'Analyse NLP illimitée', 'Accès API (100 req/min)'].map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-textMuted">
                <Check className="w-4 h-4 text-primary" /> {feat}
              </li>
            ))}
          </ul>
        </div>

        {/* Tier 3 */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <h3 className="text-xl font-bold text-textMain mb-2">Institutionnel</h3>
          <div className="text-3xl font-bold text-textMain mb-6">Sur mesure</div>
          <p className="text-textMuted mb-6">Pour les fonds, prop-shops et entreprises.</p>
          <button className="w-full py-3 rounded-lg border border-border hover:bg-border transition-colors font-semibold mb-8">Contacter les ventes</button>
          <ul className="space-y-3">
            {['Liquidité dédiée', 'Accès FIX API (ultra-low latency)', 'Account Manager dédié', 'SLA de 99.99%', 'Hébergement sur mesure'].map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-textMuted">
                <Check className="w-4 h-4 text-primary" /> {feat}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
