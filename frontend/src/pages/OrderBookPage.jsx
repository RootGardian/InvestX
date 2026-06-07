import React from 'react';

const OrderBookPage = () => {
  const asks = [
    { price: '64,250.00', amount: '1.250', total: '1.250' },
    { price: '64,245.50', amount: '0.500', total: '1.750' },
    { price: '64,240.00', amount: '2.100', total: '3.850' },
    { price: '64,235.00', amount: '0.850', total: '4.700' },
    { price: '64,232.50', amount: '3.400', total: '8.100' },
  ].reverse();

  const bids = [
    { price: '64,230.50', amount: '1.100', total: '1.100' },
    { price: '64,228.00', amount: '0.450', total: '1.550' },
    { price: '64,225.00', amount: '2.800', total: '4.350' },
    { price: '64,220.00', amount: '5.000', total: '9.350' },
    { price: '64,215.50', amount: '1.200', total: '10.550' },
  ];

  return (
    <div className="container mx-auto px-4 py-12 flex-grow">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textMain mb-2">Carnet d'Ordres Interne (BTC/USD)</h1>
        <p className="text-textMuted">Moteur de matching FIFO haute performance.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Book Column */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border font-medium flex justify-between text-sm text-textMuted">
            <span>Prix (USD)</span>
            <span>Montant (BTC)</span>
            <span>Total</span>
          </div>
          
          <div className="p-1">
            {/* Asks (Sell orders) */}
            <div className="flex flex-col gap-1 mb-2">
              {asks.map((ask, i) => (
                <div key={'ask'+i} className="flex justify-between px-3 py-1 text-sm relative group hover:bg-background/50">
                  <div className="absolute top-0 right-0 bottom-0 bg-bearish/10" style={{ width: `${(parseFloat(ask.total) / 15) * 100}%` }}></div>
                  <span className="text-bearish relative z-10">{ask.price}</span>
                  <span className="text-textMain relative z-10">{ask.amount}</span>
                  <span className="text-textMuted relative z-10">{ask.total}</span>
                </div>
              ))}
            </div>

            {/* Current Price */}
            <div className="py-3 text-center border-y border-border/50 bg-background/30">
              <span className="text-2xl font-bold text-textMain">64,231.25</span>
              <span className="text-textMuted text-sm ml-2">$64,231.25</span>
            </div>

            {/* Bids (Buy orders) */}
            <div className="flex flex-col gap-1 mt-2">
              {bids.map((bid, i) => (
                <div key={'bid'+i} className="flex justify-between px-3 py-1 text-sm relative group hover:bg-background/50">
                  <div className="absolute top-0 right-0 bottom-0 bg-bullish/10" style={{ width: `${(parseFloat(bid.total) / 15) * 100}%` }}></div>
                  <span className="text-bullish relative z-10">{bid.price}</span>
                  <span className="text-textMain relative z-10">{bid.amount}</span>
                  <span className="text-textMuted relative z-10">{bid.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Form Column */}
        <div className="bg-card border border-border rounded-xl p-6 h-fit">
          <h3 className="font-bold text-textMain mb-6">Placer un ordre</h3>
          
          <div className="flex gap-2 p-1 bg-background rounded-lg mb-6">
            <button className="flex-1 py-2 bg-card rounded shadow text-sm font-medium">Limite</button>
            <button className="flex-1 py-2 text-textMuted hover:text-textMain text-sm font-medium">Marché</button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs text-textMuted mb-1 block">Prix (USD)</label>
              <input type="text" defaultValue="64231.25" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-textMain focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-textMuted mb-1 block">Montant (BTC)</label>
              <input type="text" placeholder="0.00" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-textMain focus:border-primary focus:outline-none" />
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-bullish hover:bg-bullish/90 text-white font-bold py-3 rounded-lg transition-colors">Acheter</button>
            <button className="flex-1 bg-bearish hover:bg-bearish/90 text-white font-bold py-3 rounded-lg transition-colors">Vendre</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBookPage;
