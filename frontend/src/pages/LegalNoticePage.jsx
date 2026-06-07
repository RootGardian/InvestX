import React from 'react';

const LegalNoticePage = () => {
  return (
    <div className="container mx-auto px-4 py-12 flex-grow">
      <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 md:p-12">
        <h1 className="text-3xl font-bold text-textMain mb-8">Mentions Légales</h1>

        <div className="space-y-6 text-textMuted leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-textMain mb-2">Éditeur du site</h2>
            <p>
              <strong>InvestX Fintech Solutions SAS</strong><br />
              Société par Actions Simplifiée au capital de 100 000 €<br />
              RCS Paris B 123 456 789<br />
              Siège social : 10 rue de la Bourse, 75002 Paris, France<br />
              Directeur de la publication : Jean Dupont
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-textMain mb-2">Hébergement</h2>
            <p>
              Ce site et la base de données PostgreSQL associée sont hébergés par :<br />
              <strong>Amazon Web Services (AWS) Europe</strong><br />
              38 Avenue John F. Kennedy, L-1855, Luxembourg
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-textMain mb-2">Avertissement Réglementaire (AMF)</h2>
            <p>
              InvestX n'est pas un courtier en bourse enregistré ni un conseiller financier agréé par l'Autorité des Marchés Financiers (AMF). 
              La plateforme opère exclusivement comme un environnement de simulation ("Paper Trading") à des fins éducatives.
            </p>
            <div className="mt-4 p-4 bg-bearish/10 border border-bearish/20 rounded-lg text-bearish text-sm">
              <strong className="block mb-1 uppercase text-xs tracking-wider">Avertissement sur les risques</strong>
              Le trading comporte des risques significatifs de perte en capital. Les performances passées ou simulées ne préjugent pas des performances futures.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LegalNoticePage;
