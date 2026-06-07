import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, LineStyle, CandlestickSeries } from 'lightweight-charts';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const TradingChart = ({ ticker }) => {
  const chartContainerRef = useRef(null);
  const { token } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticker || !chartContainerRef.current) return;

    // Fetch data
    const fetchCandles = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const to = new Date().toISOString();
        const from = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(); // 90 days ago
        
        const res = await fetch(`/api/market/candles/${ticker}?period1=${from}&period2=${to}&interval=1d`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Error fetching data');
        }

        if (!data || data.length === 0) {
          throw new Error('No data available for this ticker');
        }

        // Format data for lightweight-charts
        // Must be { time, open, high, low, close }
        // time should be in seconds
        const formattedData = data.map(c => ({
          time: Math.floor(new Date(c.date).getTime() / 1000),
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close
        })).sort((a, b) => a.time - b.time); // ensure sorted ascending

        // Init Chart
        const chart = createChart(chartContainerRef.current, {
          layout: {
            background: { type: ColorType.Solid, color: '#0A192F' }, // Dark blue background
            textColor: '#8b96a8',
          },
          grid: {
            vertLines: { 
              color: '#162C4A', 
              style: LineStyle.Dotted,
            },
            horzLines: { 
              color: '#162C4A', 
              style: LineStyle.Dotted,
            },
          },
          width: chartContainerRef.current.clientWidth,
          height: 400,
          timeScale: {
            timeVisible: true,
            secondsVisible: false,
            borderColor: '#162C4A',
          },
          rightPriceScale: {
            borderColor: '#162C4A',
          }
        });

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
          upColor: '#53C953', // Bright green
          downColor: '#E63C3C', // Bright red
          borderVisible: false,
          wickUpColor: '#53C953',
          wickDownColor: '#E63C3C',
        });

        candlestickSeries.setData(formattedData);
        chart.timeScale().fitContent();

        // Handle resize
        const handleResize = () => {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        };
        window.addEventListener('resize', handleResize);

        setIsLoading(false);

        // Cleanup
        return () => {
          window.removeEventListener('resize', handleResize);
          chart.remove();
        };
      } catch (err) {
        console.error("Error drawing chart:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    const cleanupPromise = fetchCandles();
    
    return () => {
      cleanupPromise.then(cleanup => {
        if (cleanup) cleanup();
      });
    };
  }, [ticker, token]);

  return (
    <div className="relative w-full h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/50 backdrop-blur-sm rounded-xl">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      {error && !isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-card rounded-xl">
          <p className="text-bearish">{error}</p>
        </div>
      )}
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
};

export default TradingChart;
