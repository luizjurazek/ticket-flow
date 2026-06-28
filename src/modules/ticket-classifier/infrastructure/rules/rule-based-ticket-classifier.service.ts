import { ITicketClassifier } from '@/modules/ticket-classifier/domain/services/ticket-classifier.interface';
import { ITicketClassification } from '@/shared/domain/ticket/ticket-classification.interface';
import { TicketChannel, TicketPriority } from '@/shared/domain/ticket/ticket.enums';
import { CHANNEL_KEYWORDS } from './channel-keywords';

export class RuleBasedTicketClassifierService implements ITicketClassifier {
  async classify(message: string): Promise<ITicketClassification> {
    const normalizedMessage = message.toLowerCase().trim();

    const scores = this.scoreChannels(normalizedMessage);
    const ranked = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .filter(([, score]) => score > 0);

    const hasAmbiguity = ranked.length > 1 && ranked[0][1] === ranked[1][1];

    const channel = (ranked[0]?.[0] as TicketChannel) ?? TicketChannel.CUSTOMER_SERVICE;
    const priority = this.resolvePriority(channel, normalizedMessage);
    const manuallyReview = hasAmbiguity || ranked.length === 0 || normalizedMessage.length < 10;

    return { channel, priority, manuallyReview };
  }

  private scoreChannels(message: string): Record<TicketChannel, number> {
    return Object.entries(CHANNEL_KEYWORDS).reduce(
      (acc, [channel, keywords]) => {
        acc[channel as TicketChannel] = keywords.reduce(
          (score, keyword) => score + (message.includes(keyword) ? 1 : 0),
          0,
        );
        return acc;
      },
      {} as Record<TicketChannel, number>,
    );
  }

  private resolvePriority(channel: TicketChannel, message: string): TicketPriority {
    if (channel === TicketChannel.OMBUDSMAN) return TicketPriority.HIGH;
    if (channel === TicketChannel.OUT_OF_SCOPE) return TicketPriority.LOW;
    if (channel === TicketChannel.TECHNICAL_SUPPORT) {
      const isBlocking = ['não consigo', 'indisponível', 'não funciona'].some((term) => message.includes(term));
      return isBlocking ? TicketPriority.HIGH : TicketPriority.MEDIUM;
    }
    return TicketPriority.MEDIUM;
  }
}
