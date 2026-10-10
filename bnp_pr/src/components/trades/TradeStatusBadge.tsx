import React from 'react';
import type { TradeStatus } from '../../types';

export const TradeStatusBadge: React.FC<{ status: TradeStatus }> = ({ status }) => {
  let badgeClass = '';
  
  switch (status) {
    case 'COMPLETED':
      badgeClass = 'badge-success';
      break;
    case 'PENDING':
    case 'PROCESSING':
      badgeClass = 'badge-warning';
      break;
    case 'FAILED':
      badgeClass = 'badge-error';
      break;
    default:
      badgeClass = 'badge-info';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {status}
    </span>
  );
};
