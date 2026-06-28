export const TicketChannel = {
  OMBUDSMAN: 'ombudsman',
  CUSTOMER_SERVICE: 'customer_service',
  TECHNICAL_SUPPORT: 'technical_support',
  FINANCE: 'finance',
  OUT_OF_SCOPE: 'out_of_scope',
} as const;
export type TicketChannel = (typeof TicketChannel)[keyof typeof TicketChannel];

export const TicketPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;
export type TicketPriority = (typeof TicketPriority)[keyof typeof TicketPriority];

export const TicketStatus = {
  OPEN: 'open',
  CLOSED: 'closed',
  IN_PROGRESS: 'in_progress',
} as const;
export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];
