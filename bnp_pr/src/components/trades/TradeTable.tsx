import React, { useState } from 'react';
import type { Trade } from '../../types';
import { TradeStatusBadge } from './TradeStatusBadge';
import { Filter, ChevronRight } from 'lucide-react';

interface TradeTableProps {
  trades: Trade[];
  onRowClick: (trade: Trade) => void;
}

export const TradeTable: React.FC<TradeTableProps> = ({ trades, onRowClick }) => {
  const [filter, setFilter] = useState('ALL');
  
  const filteredTrades = filter === 'ALL' 
    ? trades 
    : trades.filter(t => t.status === filter);

  return (
    <div className="table-container">
      <div className="table-header">
        <h3 className="table-title">Recent Trade Events</h3>
        <div className="table-actions">
          <select 
            className="btn btn-secondary"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '0.25rem 0.5rem', outline: 'none' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="FAILED">Failed</option>
          </select>
          <button className="btn btn-secondary">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Trade ID</th>
              <th>Version</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Last Update</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.map((trade) => (
              <tr key={trade.id} onClick={() => onRowClick(trade)}>
                <td>
                  <div className="cell-primary">{trade.tradeId}</div>
                  <div className="cell-secondary">ID: {trade.id}</div>
                </td>
                <td>
                  <div className="cell-primary">v{trade.versionNumber.toString().padStart(3, '0')}</div>
                </td>
                <td>
                  <div className="cell-primary">{trade.client || 'N/A'}</div>
                </td>
                <td>
                  <div className="cell-primary">
                    {trade.amount ? `${trade.amount.toLocaleString()} ${trade.currency}` : 'N/A'}
                  </div>
                </td>
                <td>
                  <TradeStatusBadge status={trade.status} />
                </td>
                <td>
                  <div className="cell-primary">
                    {new Date(trade.updatedAt).toLocaleTimeString()}
                  </div>
                  <div className="cell-secondary">
                    {new Date(trade.updatedAt).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <ChevronRight size={20} color="var(--text-muted)" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
