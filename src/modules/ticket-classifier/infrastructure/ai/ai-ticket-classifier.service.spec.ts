import { AITicketClassifierService } from './ai-ticket-classifier.service';
import { ticketClassifierScenarios } from '@/test/helpers/ticket-classifier-scenarios';
import { IAIProvider } from '@/shared/infra/ai/ai.provider.interface';

describe('AITicketClassifierService', () => {
  let aiProvider: jest.Mocked<IAIProvider>;
  let classifier: AITicketClassifierService;

  beforeEach(() => {
    aiProvider = { generateText: jest.fn() };
    classifier = new AITicketClassifierService(aiProvider);
  });

  it.each(ticketClassifierScenarios)(
    'should parse Gemini response for: $message',
    async ({ message, classification }) => {
      aiProvider.generateText.mockResolvedValue(JSON.stringify(classification));

      const result = await classifier.classify(message);

      expect(result).toEqual(classification);
      expect(aiProvider.generateText).toHaveBeenCalledWith(expect.stringContaining(message));
    },
  );
});
