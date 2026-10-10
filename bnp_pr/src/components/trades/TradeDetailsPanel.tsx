import React from 'react';
import type { Trade } from '../../types';
import { TradeStatusBadge } from './TradeStatusBadge';
import { X, Clock, Server, AlertOctagon } from 'lucide-react';

interface TradeDetailsPanelProps {
  trade: Trade;
  onClose: () => void;
}

export const TradeDetailsPanel: React.FC<TradeDetailsPanelProps> = ({ trade, onClose }) => {
  return (
    <div className="card animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 className="table-title">Trade Details</h3>
        <button className="icon-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div style={{ padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Trade ID</span>
          <span style={{ fontWeight: 600 }}>{trade.tradeId}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Version</span>
          <span>v{trade.versionNumber.toString().padStart(3, '0')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Client</span>
          <span>{trade.client || 'N/A'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Amount</span>
          <span style={{ fontWeight: 600 }}>{trade.amount ? `${trade.amount.toLocaleString()} ${trade.currency}` : 'N/A'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Status</span>
          <TradeStatusBadge status={trade.status} />
        </div>
      </div>

      <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Lifecycle Events</h4>
      
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
        {trade.events.map((event, index) => (
          <div key={event.eventId} style={{ display: 'flex', marginBottom: '1.5rem', position: 'relative' }}>
            {/* Timeline Line */}
            {index !== trade.events.length - 1 && (
              <div style={{ position: 'absolute', left: '15px', top: '30px', bottom: '-20px', width: '2px', backgroundColor: 'var(--border-color)' }}></div>
            )}
            
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              backgroundColor: event.eventStatus.includes('FAILED') ? 'var(--status-error-bg)' : 'var(--bg-tertiary)',
              border: `1px solid ${event.eventStatus.includes('FAILED') ? 'var(--status-error)' : 'var(--border-color)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, marginRight: '1rem', flexShrink: 0
            }}>
              <Server size={14} color={event.eventStatus.includes('FAILED') ? 'var(--status-error)' : 'var(--brand-primary)'} />
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <strong style={{ fontSize: '0.875rem' }}>{event.eventStatus.replace(/_/g, ' ')}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} />
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ display: 'inline-block', padding: '0.1rem 0.4rem', backgroundColor: 'var(--bg-primary)', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                  System: {event.sourceSystem}
                </span>
              </div>
              
              {event.metadata && (
                <div style={{ backgroundColor: 'var(--status-error-bg)', border: '1px solid var(--status-error)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-error)', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.75rem' }}>
                    <AlertOctagon size={14} /> {event.metadata.errorCode}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                    {event.metadata.errorMessage}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
