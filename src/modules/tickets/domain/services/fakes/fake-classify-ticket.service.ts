import { IClassifyTicketService } from '@/modules/tickets/domain/services/classify-ticket.service.interface';
import { ITicketClassification } from '@/shared/domain/ticket/ticket-classification.interface';
import { TicketChannel, TicketPriority } from '@/shared/domain/ticket/ticket.enums';

export class FakeClassifyTicketService implements IClassifyTicketService {
  private readonly classifications = new Map<string, ITicketClassification>();
  private readonly calls: string[] = [];

  setClassification(message: string, classification: ITicketClassification): void {
    this.classifications.set(message, classification);
  }

  getCalls(): string[] {
    return this.calls;
  }

  async classify(message: string): Promise<ITicketClassification> {
    this.calls.push(message);
    return (
      this.classifications.get(message) ?? {
        channel: TicketChannel.CUSTOMER_SERVICE,
        priority: TicketPriority.MEDIUM,
        manuallyReview: false,
      }
    );
  }
}
