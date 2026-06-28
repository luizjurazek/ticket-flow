import { IAIProvider } from '@/shared/infra/ai/ai.provider.interface';
import { ITicketClassifier } from '@/modules/ticket-classifier/domain/services/ticket-classifier.interface';
import { ITicketClassification } from '@/shared/domain/ticket/ticket-classification.interface';
import { AppError } from '@/shared/errors/app-error';
import { HttpStatus } from '@/shared/http/http-status';
import { buildTicketClassifierPrompt } from './prompts/ticket-classifier.prompt';
import { TicketChannel, TicketPriority } from '@/shared/domain/ticket/ticket.enums';

const VALID_CHANNELS: TicketChannel[] = Object.values(TicketChannel);
const VALID_PRIORITIES: TicketPriority[] = Object.values(TicketPriority);

export class AITicketClassifierService implements ITicketClassifier {
  constructor(private readonly aiProvider: IAIProvider) {}

  async classify(message: string): Promise<ITicketClassification> {
    const prompt = buildTicketClassifierPrompt(message);
    const rawResponse = await this.aiProvider.generateText(prompt);
    return this.parseClassification(rawResponse);
  }

  private parseClassification(rawResponse: string): ITicketClassification {
    try {
      const cleaned = rawResponse.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned) as ITicketClassification;
      if (!this.isValidChannel(parsed.channel as string) || !this.isValidPriority(parsed.priority as string)) {
        throw new AppError('Invalid classification values', HttpStatus.BAD_REQUEST);
      }

      return {
        channel: parsed.channel as TicketChannel,
        priority: parsed.priority as TicketPriority,
        manuallyReview: this.parseManuallyReview(parsed.manuallyReview),
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to classify ticket', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private isValidChannel(channel: string): channel is TicketChannel {
    return VALID_CHANNELS.includes(channel as TicketChannel);
  }
  private isValidPriority(priority: string): priority is TicketPriority {
    return VALID_PRIORITIES.includes(priority as TicketPriority);
  }

  private parseManuallyReview(value: unknown): boolean {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return false;
  }
}
