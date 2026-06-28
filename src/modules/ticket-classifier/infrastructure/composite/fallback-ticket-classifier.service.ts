import { ITicketClassifier } from '@/modules/ticket-classifier/domain/services/ticket-classifier.interface';
import { ITicketClassification } from '@/shared/domain/ticket/ticket-classification.interface';
import { StructuredLogger } from '@/shared/infra/logger/logger';

export class FallbackTicketClassifierService implements ITicketClassifier {
  constructor(
    private readonly primaryClassifier: ITicketClassifier,
    private readonly fallbackClassifier: ITicketClassifier,
  ) {}
  async classify(message: string): Promise<ITicketClassification> {
    try {
      return await this.primaryClassifier.classify(message);
    } catch (error) {
      StructuredLogger.warn('AI classifier unavailable, using rule-based fallback', {
        module: 'ticket-classifier',
        details: error,
      });
      return this.fallbackClassifier.classify(message);
    }
  }
}
