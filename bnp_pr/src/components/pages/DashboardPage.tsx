import React, { useState } from 'react';
import { SummaryCards } from '../dashboard/SummaryCards';
import { SlaAlerts } from '../dashboard/SlaAlerts';
import { TradeTable } from '../trades/TradeTable';
import { TradeDetailsPanel } from '../trades/TradeDetailsPanel';
import { mockTrades } from '../../services/mockData';
import type { Trade } from '../../types';

export const DashboardPage: React.FC = () => {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div className="page-header">
        <h2 className="page-title">Trade Event Monitoring</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary">Export Report</button>
          <button className="btn btn-primary">Refresh Data</button>
        </div>
      </div>

      <SummaryCards trades={mockTrades} />
      <SlaAlerts trades={mockTrades} />

      <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 350px)', minHeight: '500px' }}>
        <div style={{ flex: selectedTrade ? 2 : 1, transition: 'all 0.3s' }}>
          <TradeTable trades={mockTrades} onRowClick={setSelectedTrade} />
        </div>
        
        {selectedTrade && (
          <div style={{ flex: 1, minWidth: '400px' }}>
            <TradeDetailsPanel trade={selectedTrade} onClose={() => setSelectedTrade(null)} />
          </div>
        )}
      </div>
    </div>
  );
};
