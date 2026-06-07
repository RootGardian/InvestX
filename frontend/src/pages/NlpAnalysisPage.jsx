import React from 'react';
import { BrainCircuit, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const NlpAnalysisPage = () => {
  const news = [
    { headline: "Apple annonce des profits record pour Q3", source: "Bloomberg", sentiment: "BULLISH", score: "+0.85" },
    { headline: "NVIDIA fait face à de nouvelles restrictions d'exportation", source: "Reuters", sentiment: "BEARISH", score: "-0.62" },
    { headline: "La FED maintient ses taux directeurs", source: "Wall Street Journal", sentiment: "NEUTRAL", score: "0.05" },
    { headline: "Tesla dépasse les attentes de livraisons", source: "CNBC", sentiment: "BULLISH", score: "+0.71" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 flex-grow">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-textMain mb-4">Analyse de Sentiment par IA</h1>
          <p className="text-lg text-textMuted">Notre algorithme NLP exclusif analyse les flux de nouvelles financières en temps réel pour en extraire l'humeur du marché.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card border border-border p-6 rounded-xl text-center">
            <div className="text-3xl font-bold text-bullish mb-2">68%</div>
            <div className="text-sm text-textMuted uppercase tracking-wider">Marché Haussier</div>
          </div>
          <div className="bg-card border border-border p-6 rounded-xl text-center">
            <div className="text-3xl font-bold text-textMuted mb-2">12%</div>
            <div className="text-sm text-textMuted uppercase tracking-wider">Neutre</div>
          </div>
          <div className="bg-card border border-border p-6 rounded-xl text-center">
            <div className="text-3xl font-bold text-bearish mb-2">20%</div>
            <div className="text-sm text-textMuted uppercase tracking-wider">Marché Baissier</div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-textMain mb-6">Dernières analyses en direct</h2>
        <div className="space-y-4">
          {news.map((item, idx) => (
            <div key={idx} className="bg-card border border-border p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 transition-colors">
              <div>
                <h3 className="text-lg font-medium text-textMain mb-1">{item.headline}</h3>
                <p className="text-sm text-textMuted">Source: {item.source} • Il y a 5 min</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-sm font-medium text-textMuted">Score NLP</div>
                  <div className="font-bold text-textMain">{item.score}</div>
                </div>
                <div className={`px-4 py-2 rounded-lg flex items-center font-bold text-sm ${
                  item.sentiment === 'BULLISH' ? 'bg-bullish/10 text-bullish' :
                  item.sentiment === 'BEARISH' ? 'bg-bearish/10 text-bearish' :
                  'bg-border text-textMuted'
                }`}>
                  {item.sentiment === 'BULLISH' && <ArrowUpRight className="w-4 h-4 mr-1" />}
                  {item.sentiment === 'BEARISH' && <ArrowDownRight className="w-4 h-4 mr-1" />}
                  {item.sentiment === 'NEUTRAL' && <Minus className="w-4 h-4 mr-1" />}
                  {item.sentiment}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NlpAnalysisPage;
