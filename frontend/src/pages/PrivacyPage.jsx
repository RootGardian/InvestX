import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 flex-grow">
      <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 md:p-12">
        <h1 className="text-3xl font-bold text-textMain mb-2">Politique de Confidentialité</h1>
        <p className="text-sm text-textMuted mb-8">Dernière mise à jour : 1er Juin 2026</p>

        <div className="space-y-6 text-textMuted leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-textMain mb-3">1. Collecte des données</h2>
            <p>Nous collectons les informations suivantes lors de votre inscription et de votre utilisation de la plateforme : nom, adresse e-mail, historique des transactions virtuelles, et logs de connexion API. Ces données sont chiffrées et stockées de manière sécurisée (Salt & Pepper).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-textMain mb-3">2. Utilisation des données</h2>
            <p>Vos données sont utilisées exclusivement pour :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-textMuted">
              <li>Assurer le bon fonctionnement de votre portefeuille virtuel.</li>
              <li>Améliorer nos algorithmes de matching (Order Book).</li>
              <li>Sécuriser votre compte via l'authentification JWT.</li>
              <li>Vous envoyer des notifications importantes concernant le service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-textMain mb-3">3. Partage avec des tiers</h2>
            <p>InvestX ne vend, ne loue ni ne partage vos données personnelles avec des tiers à des fins commerciales. Certaines données techniques anonymisées peuvent être partagées avec nos partenaires d'infrastructure pour assurer la stabilité du service (uptime 99.99%).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-textMain mb-3">4. Vos droits (RGPD)</h2>
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles. Vous pouvez exercer ces droits en contactant notre DPO à privacy@investx.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
