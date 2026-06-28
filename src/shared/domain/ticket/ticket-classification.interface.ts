import { TicketChannel, TicketPriority } from '@/shared/domain/ticket/ticket.enums';

export interface ITicketClassification {
  channel: TicketChannel;
  priority: TicketPriority;
  manuallyReview: boolean;
}
