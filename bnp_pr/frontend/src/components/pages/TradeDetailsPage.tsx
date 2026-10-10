import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TradeDetailsPanel } from '../trades/TradeDetailsPanel';
import { mockTrades } from '../../services/mockData';
import type { Trade } from '../../types';
import { Loader, ArrowLeft } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/trades';

export const TradeDetailsPage: React.FC = () => {
  const { tradeId } = useParams<{ tradeId: string }>();
  const navigate = useNavigate();
  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrade = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('API response was not ok');
        const data: Trade[] = await response.json();
        const found = data.find(t => t.tradeId === tradeId);
        if (found) {
          setTrade(found);
        } else {
          setError(`Trade with ID ${tradeId} not found.`);
        }
      } catch (err) {
        console.warn('Backend API is not reachable yet. Falling back to mock data.');
        const found = mockTrades.find(t => t.tradeId === tradeId);
        if (found) {
          setTrade(found);
        } else {
          setError(`Trade with ID ${tradeId} not found.`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (tradeId) {
      fetchTrade();
    }
  }, [tradeId]);

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="icon-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
          </button>
          <h2 className="page-title">Trade Specific View</h2>
        </div>
      </div>

      <div style={{ height: 'calc(100vh - 150px)' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--brand-primary)' }}>
            <Loader size={48} className="animate-spin" />
          </div>
        ) : error ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--status-error)' }}>
            <h3>Error</h3>
            <p>{error}</p>
            <button className="btn btn-secondary" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>Back to Dashboard</button>
          </div>
        ) : trade ? (
          <div style={{ maxWidth: '800px', margin: '0 auto', height: '100%' }}>
            <TradeDetailsPanel trade={trade} onClose={() => navigate('/')} />
          </div>
        ) : null}
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
