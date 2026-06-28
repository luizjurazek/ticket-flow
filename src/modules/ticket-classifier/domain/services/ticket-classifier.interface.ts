import { ITicketClassification } from '@/shared/domain/ticket/ticket-classification.interface';

export interface ITicketClassifier {
  classify(message: string): Promise<ITicketClassification>;
}
