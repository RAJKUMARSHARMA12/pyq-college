export type TradeStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface TradeEvent {
  eventId: string;
  tradeId: string;
  versionNumber: number;
  timestamp: string;
  sourceSystem: string;
  eventStatus: string;
  metadata?: Record<string, any>;
}

export interface Trade {
  id: string;
  tradeId: string;
  versionNumber: number;
  status: TradeStatus;
  createdAt: string;
  updatedAt: string;
  amount?: number;
  currency?: string;
  client?: string;
  expectedSlaBreach?: boolean;
  events: TradeEvent[];
}
