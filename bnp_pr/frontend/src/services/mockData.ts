import type { Trade } from '../types';

// This mock data exactly reflects the booking.csv, confirmation.csv, and settlement.csv files
export const mockTrades: Trade[] = [
  {
    id: '1',
    tradeId: 'TRD_1000',
    versionNumber: 287,
    status: 'COMPLETED',
    createdAt: '2026-10-12T14:00:44Z',
    updatedAt: '2026-10-12T14:04:10Z',
    events: [
      {
        eventId: 'b2b71b7e-2992-41a9-84c9-02c6580d8618',
        tradeId: 'TRD_1000',
        versionNumber: 287,
        timestamp: '2026-10-12T14:00:44Z',
        sourceSystem: 'BOOKING',
        eventStatus: 'BOOKING_SUCCESS',
        metadata: {
          payloadFormat: 'XML'
        }
      },
      {
        eventId: 'c8bc5e7b-2e3a-4874-918e-12306e85040a',
        tradeId: 'TRD_1000',
        versionNumber: 287,
        timestamp: '2026-10-12T14:02:48Z',
        sourceSystem: 'SETTLEMENT',
        eventStatus: 'SETTLEMENT_SUCCESS',
        metadata: {
          eventId: 'c8bc5e7b-2e3a-4874-918e-12306e85040a',
          payloadFormat: 'PIPE_DELIMITED',
          note: 'Arrived out of order'
        }
      },
      {
        eventId: '254734ea-b86e-4631-be70-6a3c3773d271',
        tradeId: 'TRD_1000',
        versionNumber: 287,
        timestamp: '2026-10-12T14:04:10Z',
        sourceSystem: 'CONFIRMATION',
        eventStatus: 'CONFIRMATION_SUCCESS',
        metadata: {
          eventId: '254734ea-b86e-4631-be70-6a3c3773d271',
          payloadFormat: 'JSON'
        }
      }
    ]
  },
  {
    id: '2',
    tradeId: 'TRD_1001',
    versionNumber: 753,
    status: 'FAILED',
    createdAt: '2026-10-12T14:00:15Z',
    updatedAt: '2026-10-12T14:04:50Z',
    events: [
      {
        eventId: '99e030e-32fb-4e57-aaf0-701053c1b604',
        tradeId: 'TRD_1001',
        versionNumber: 753,
        timestamp: '2026-10-12T14:00:15Z',
        sourceSystem: 'BOOKING',
        eventStatus: 'BOOKING_SUCCESS',
        metadata: {
        }
      },
      {
        eventId: '402d54a1-984f-4222-9177-d9f1d6f26f08',
        tradeId: 'TRD_1001',
        versionNumber: 753,
        timestamp: '2026-10-12T14:03:18Z',
        sourceSystem: 'SETTLEMENT',
        eventStatus: 'SETTLEMENT_FAILED',
        metadata: {
          eventId: '402d54a1-984f-4222-9177-d9f1d6f26f08',
          errorCode: 'ERR_SETTLE_FUND',
          errorMessage: 'Insufficient funds for settlement'
        }
      },
      {
        eventId: 'ed0c5637-435a-46bc-89bb-a59af34c830d',
        tradeId: 'TRD_1001',
        versionNumber: 753,
        timestamp: '2026-10-12T14:04:50Z',
        sourceSystem: 'CONFIRMATION',
        eventStatus: 'CONFIRMATION_SUCCESS',
        metadata: {
          eventId: 'ed0c5637-435a-46bc-89bb-a59af34c830d'
        }
      }
    ]
  },
  {
    id: '3',
    tradeId: 'TRD_1002',
    versionNumber: 666,
    status: 'COMPLETED',
    createdAt: '2026-10-12T14:01:12Z',
    updatedAt: '2026-10-12T14:04:10Z',
    events: [
      {
        eventId: 'a7940745-6cfa-49d1-9b72-f2b3693ac4e7',
        tradeId: 'TRD_1002',
        versionNumber: 666,
        timestamp: '2026-10-12T14:01:12Z',
        sourceSystem: 'BOOKING',
        eventStatus: 'BOOKING_SUCCESS',
        metadata: {
        }
      },
      {
        eventId: 'ba75de0d-d312-498a-bbce-8c91d1b1cbe5',
        tradeId: 'TRD_1002',
        versionNumber: 666,
        timestamp: '2026-10-12T14:03:08Z',
        sourceSystem: 'SETTLEMENT',
        eventStatus: 'SETTLEMENT_SUCCESS',
        metadata: {
          eventId: 'ba75de0d-d312-498a-bbce-8c91d1b1cbe5'
        }
      },
      {
        eventId: '2a31a187-ee0f-40d5-bc42-56788a7f634e',
        tradeId: 'TRD_1002',
        versionNumber: 666,
        timestamp: '2026-10-12T14:04:10Z',
        sourceSystem: 'CONFIRMATION',
        eventStatus: 'CONFIRMATION_SUCCESS',
        metadata: {
          eventId: '2a31a187-ee0f-40d5-bc42-56788a7f634e'
        }
      }
    ]
  },
  {
    id: '4',
    tradeId: 'TRD_1010',
    versionNumber: 585,
    status: 'FAILED',
    createdAt: '2026-10-12T14:01:37Z',
    updatedAt: '2026-10-12T14:01:37Z',
    events: [
      {
        eventId: '18940e7f-9e2b-45e9-8fee-48a883fbj1dd',
        tradeId: 'TRD_1010',
        versionNumber: 585,
        timestamp: '2026-10-12T14:01:37Z',
        sourceSystem: 'BOOKING',
        eventStatus: 'BOOKING_FAILED',
        metadata: {
          errorCode: 'ERR_BOOKING_01',
          errorMessage: 'Validation failed during booking process'
        }
      }
    ]
  },
  {
    id: '5',
    tradeId: 'TRD_1006',
    versionNumber: 563,
    status: 'PROCESSING',
    createdAt: '2026-10-12T14:00:42Z',
    updatedAt: '2026-10-12T14:01:56Z',
    expectedSlaBreach: true,
    events: [
      {
        eventId: '865e1169-3dc4-49da-b711-5a5cab2497bf',
        tradeId: 'TRD_1006',
        versionNumber: 563,
        timestamp: '2026-10-12T14:00:42Z',
        sourceSystem: 'BOOKING',
        eventStatus: 'BOOKING_SUCCESS',
        metadata: {
        }
      },
      {
        eventId: 'd5adbd92-42e6-4c0d-bdb3-ae48a8610db7',
        tradeId: 'TRD_1006',
        versionNumber: 563,
        timestamp: '2026-10-12T14:01:56Z',
        sourceSystem: 'SETTLEMENT',
        eventStatus: 'SETTLEMENT_SUCCESS',
        metadata: {
          eventId: 'd5adbd92-42e6-4c0d-bdb3-ae48a8610db7',
          note: 'Awaiting confirmation'
        }
      }
    ]
  }
];
