import { GeminiProvider } from '@/shared/infra/ai/gemini.provider';
import { ITicketClassifier } from '@/modules/ticket-classifier/domain/services/ticket-classifier.interface';
import { AITicketClassifierService } from '@/modules/ticket-classifier/infrastructure/ai/ai-ticket-classifier.service';
import { RuleBasedTicketClassifierService } from '@/modules/ticket-classifier/infrastructure/rules/rule-based-ticket-classifier.service';
import { FallbackTicketClassifierService } from '../composite/fallback-ticket-classifier.service';

export function makeTicketClassifier(): ITicketClassifier {
  const geminiProvider = new GeminiProvider();
  const aiClassifier = new AITicketClassifierService(geminiProvider);
  const ruleBasedClassifier = new RuleBasedTicketClassifierService();

  return new FallbackTicketClassifierService(aiClassifier, ruleBasedClassifier);
}
