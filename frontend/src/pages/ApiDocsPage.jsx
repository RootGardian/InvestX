import React from 'react';
import { Terminal, Code, Database, Key } from 'lucide-react';

const ApiDocsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 flex-grow">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="font-bold text-textMain mb-3 uppercase text-sm tracking-wider">Introduction</h3>
              <ul className="space-y-2 text-sm text-textMuted">
                <li className="text-primary font-medium">Authentification</li>
                <li className="hover:text-textMain cursor-pointer">Rate Limits</li>
                <li className="hover:text-textMain cursor-pointer">Webhooks</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-textMain mb-3 uppercase text-sm tracking-wider">Endpoints</h3>
              <ul className="space-y-2 text-sm text-textMuted">
                <li className="hover:text-textMain cursor-pointer">GET /market/quotes</li>
                <li className="hover:text-textMain cursor-pointer">POST /orders/new</li>
                <li className="hover:text-textMain cursor-pointer">GET /nlp/sentiment</li>
                <li className="hover:text-textMain cursor-pointer">GET /portfolio</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-3xl">
          <h1 className="text-4xl font-bold text-textMain mb-4">Documentation API REST</h1>
          <p className="text-textMuted text-lg mb-8">Intégrez la puissance du moteur de matching InvestX et de l'analyse NLP directement dans vos propres algorithmes de trading.</p>

          <div className="space-y-12">
            
            <section>
              <h2 className="text-2xl font-bold text-textMain mb-4 flex items-center gap-2"><Key className="w-6 h-6 text-primary"/> Authentification</h2>
              <p className="text-textMuted mb-4">Toutes les requêtes API nécessitent un token Bearer JWT valide dans les en-têtes (Headers).</p>
              <div className="bg-[#0d1117] border border-border rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="text-textMuted mb-2">// Exemple de requête authentifiée</div>
                <div className="text-primary">curl <span className="text-white">-X GET</span> https://api.investx.com/v1/portfolio \</div>
                <div className="text-white ml-4">-H <span className="text-bullish">"Authorization: Bearer VOTRE_TOKEN_JWT"</span></div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-textMain mb-4 flex items-center gap-2"><Terminal className="w-6 h-6 text-primary"/> Placer un Ordre</h2>
              <p className="text-textMuted mb-4">Endpoint : <span className="bg-card px-2 py-1 rounded text-textMain font-mono text-sm">POST /api/v1/orders/new</span></p>
              <div className="bg-[#0d1117] border border-border rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="text-textMuted mb-2">// Payload JSON</div>
                <div className="text-white">{`{`}</div>
                <div className="text-white ml-4"><span className="text-primary">"symbol"</span>: <span className="text-bullish">"BTC/USD"</span>,</div>
                <div className="text-white ml-4"><span className="text-primary">"side"</span>: <span className="text-bullish">"BUY"</span>,</div>
                <div className="text-white ml-4"><span className="text-primary">"type"</span>: <span className="text-bullish">"LIMIT"</span>,</div>
                <div className="text-white ml-4"><span className="text-primary">"quantity"</span>: <span className="text-bearish">0.5</span>,</div>
                <div className="text-white ml-4"><span className="text-primary">"price"</span>: <span className="text-bearish">64200.00</span></div>
                <div className="text-white">{`}`}</div>
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ApiDocsPage;
