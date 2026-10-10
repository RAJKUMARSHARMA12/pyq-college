import React, { useState, useEffect } from 'react';
import { SummaryCards } from '../dashboard/SummaryCards';
import { SlaAlerts } from '../dashboard/SlaAlerts';
import { TradeTable } from '../trades/TradeTable';
import { TradeDetailsPanel } from '../trades/TradeDetailsPanel';
import { mockTrades } from '../../services/mockData';
import type { Trade } from '../../types';
import { Loader } from 'lucide-react';

// Define your Flask API URL here. Your team can change this if the backend runs on a different port.
const API_URL = 'http://localhost:5000/api/trades';

export const DashboardPage: React.FC = () => {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('API response was not ok');
      const data: Trade[] = await response.json();
      setTrades(data);
    } catch (error) {
      console.warn('Backend API is not reachable yet. Falling back to mock data.', error);
      // Fallback to mock data so the UI continues to work for demos before the backend is fully ready
      setTrades(mockTrades);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchTrades();
    
    // Optional: Set up an interval to poll every 5 seconds for real-time updates
    // const interval = setInterval(fetchTrades, 5000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div className="page-header">
        <h2 className="page-title">Trade Event Monitoring</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => console.log("Export triggered")}>Export Report</button>
          <button className="btn btn-primary" onClick={fetchTrades} disabled={loading}>
            {loading ? <Loader size={16} className="animate-spin" /> : 'Refresh Data'}
          </button>
        </div>
      </div>

      {loading && trades.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: 'var(--brand-primary)' }}>
          <Loader size={48} className="animate-spin" />
        </div>
      ) : (
        <>
          <SummaryCards trades={trades} />
          <SlaAlerts trades={trades} />

          <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 350px)', minHeight: '500px' }}>
            <div style={{ flex: selectedTrade ? 2 : 1, transition: 'all 0.3s' }}>
              <TradeTable trades={trades} onRowClick={setSelectedTrade} />
            </div>
            
            {selectedTrade && (
              <div style={{ flex: 1, minWidth: '400px' }}>
                <TradeDetailsPanel trade={selectedTrade} onClose={() => setSelectedTrade(null)} />
              </div>
            )}
          </div>
        </>
      )}
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
