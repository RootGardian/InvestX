import React from 'react';

const SocialProofSection = () => {
  const stats = [
    { value: "$2.4B+", label: "Volume virtuel échangé" },
    { value: "125k+", label: "Traders actifs" },
    { value: "< 5ms", label: "Temps d'exécution" },
    { value: "99.99%", label: "Uptime du marché" }
  ];

  return (
    <section className="py-20 bg-card border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/0 md:divide-border">
          {stats.map((stat, index) => (
            <div key={index} className="text-center px-4">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-textMuted mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base font-medium text-textMuted uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SocialProofSection;
