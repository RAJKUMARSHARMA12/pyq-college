import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import type { Trade } from '../../types';

interface SlaAlertsProps {
  trades: Trade[];
}

export const SlaAlerts: React.FC<SlaAlertsProps> = ({ trades }) => {
  const breachedTrades = trades.filter(t => t.expectedSlaBreach);

  if (breachedTrades.length === 0) {
    return null;
  }

  return (
    <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--status-warning)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--status-warning)' }}>
        <AlertTriangle size={20} />
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>SLA Breaches Detected</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {breachedTrades.map(trade => (
          <div key={trade.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{trade.tradeId}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Client: {trade.client}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-warning)', fontSize: '0.875rem', fontWeight: 500 }}>
              <Clock size={16} /> Overdue by 15 mins
            </div>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
              Investigate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
