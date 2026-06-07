import React from 'react';
import { Zap, Shield, LineChart } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Exécution ultra-rapide",
      description: "Notre moteur de matching en temps réel assure l'exécution de vos ordres en quelques millisecondes, sans glissement (slippage)."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Sécurité de pointe",
      description: "Simulation 100% sans risque avec une intégrité transactionnelle garantie. Vos données sont protégées par chiffrement avancé."
    },
    {
      icon: <LineChart className="w-8 h-8 text-primary" />,
      title: "Analyse en temps réel",
      description: "Accédez à des flux de données boursières en direct, intégrez l'analyse de sentiment NLP et utilisez des graphiques interactifs avancés."
    }
  ];

  return (
    <section id="tools" className="py-24 bg-background border-t border-border/50 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-textMain mb-4">
            Une plateforme conçue pour la performance
          </h2>
          <p className="text-textMuted text-lg">
            InvestX vous fournit les outils institutionnels nécessaires pour comprendre les marchés et optimiser vos stratégies de trading.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <article 
              key={index} 
              className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-colors group"
            >
              <div className="bg-background border border-border w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-textMain mb-3">{feature.title}</h3>
              <p className="text-textMuted leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
