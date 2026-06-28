import { GeminiProvider } from '@/shared/infra/ai/gemini.provider';
import { ITicketClassifier } from '@/modules/ticket-classifier/domain/services/ticket-classifier.interface';
import { AITicketClassifierService } from '@/modules/ticket-classifier/infrastructure/ai/ai-ticket-classifier.service';

export function makeTicketClassifier(): ITicketClassifier {
  const geminiProvider = new GeminiProvider();
  return new AITicketClassifierService(geminiProvider);
}
