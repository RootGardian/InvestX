import React from 'react';

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 flex-grow">
      <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 md:p-12">
        <h1 className="text-3xl font-bold text-textMain mb-2">Conditions Générales d'Utilisation</h1>
        <p className="text-sm text-textMuted mb-8">Dernière mise à jour : 1er Juin 2026</p>

        <div className="space-y-6 text-textMuted leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-textMain mb-3">1. Acceptation des conditions</h2>
            <p>En accédant et en utilisant la plateforme InvestX (la "Plateforme"), vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-textMain mb-3">2. Nature du Service (Simulation)</h2>
            <p>InvestX est une plateforme éducative et de simulation de trading. L'argent virtuel (capital initial de 100 000 $) fourni n'a aucune valeur réelle et ne peut en aucun cas être retiré ou échangé contre des devises réelles. Les performances réalisées sur le simulateur ne garantissent pas des résultats similaires en conditions réelles de marché.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-textMain mb-3">3. Utilisation de l'API</h2>
            <p>L'utilisation de notre API REST est soumise à des limites de requêtes (Rate Limits) définies selon votre plan tarifaire. Toute tentative de contournement de ces limites ou de surcharge volontaire de nos serveurs entraînera la suspension immédiate de votre compte.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-textMain mb-3">4. Analyse NLP et Données</h2>
            <p>Les signaux fournis par notre moteur d'analyse de sentiment (NLP) sont générés par des algorithmes d'intelligence artificielle et ne constituent en aucun cas un conseil en investissement. InvestX décline toute responsabilité quant aux décisions financières prises sur la base de ces analyses.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-textMain mb-3">5. Résiliation</h2>
            <p>Nous nous réservons le droit de suspendre ou de résilier votre compte à tout moment, sans préavis, en cas de violation de ces conditions générales d'utilisation ou pour toute autre raison jugée valable par notre équipe de modération.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
