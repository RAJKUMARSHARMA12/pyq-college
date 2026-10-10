import React from 'react';
import { ArrowDownRight, ArrowUpRight, CheckCircle, Clock, XCircle, Activity } from 'lucide-react';
import type { Trade } from '../../types';

interface SummaryCardsProps {
  trades: Trade[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ trades }) => {
  const total = trades.length;
  const completed = trades.filter(t => t.status === 'COMPLETED').length;
  const pending = trades.filter(t => t.status === 'PENDING' || t.status === 'PROCESSING').length;
  const failed = trades.filter(t => t.status === 'FAILED').length;

  return (
    <div className="summary-grid">
      <div className="card summary-card">
        <div className="summary-header">
          <span>Total Trades</span>
          <Activity size={18} color="var(--brand-primary)" />
        </div>
        <div className="summary-value">{total}</div>
        <div className="summary-trend">
          <span className="trend-up"><ArrowUpRight size={14} /> +12%</span> vs last hour
        </div>
      </div>
      
      <div className="card summary-card">
        <div className="summary-header">
          <span>Successful</span>
          <CheckCircle size={18} color="var(--status-success)" />
        </div>
        <div className="summary-value">{completed}</div>
        <div className="summary-trend">
          <span className="trend-up"><ArrowUpRight size={14} /> +5%</span> vs last hour
        </div>
      </div>
      
      <div className="card summary-card">
        <div className="summary-header">
          <span>Pending / Processing</span>
          <Clock size={18} color="var(--status-warning)" />
        </div>
        <div className="summary-value">{pending}</div>
        <div className="summary-trend">
          <span className="trend-down"><ArrowDownRight size={14} /> -2%</span> vs last hour
        </div>
      </div>
      
      <div className="card summary-card" style={{ borderLeft: '4px solid var(--status-error)' }}>
        <div className="summary-header">
          <span>Failed Alerts</span>
          <XCircle size={18} color="var(--status-error)" />
        </div>
        <div className="summary-value">{failed}</div>
        <div className="summary-trend">
          <span className="trend-down"><ArrowDownRight size={14} /> -1%</span> vs last hour
        </div>
      </div>
    </div>
  );
};
