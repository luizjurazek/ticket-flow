import { ITicketClassification } from '@/shared/domain/ticket/ticket-classification.interface';

export interface IClassifyTicketService {
  classify(message: string): Promise<ITicketClassification>;
}
