import { faker } from '@faker-js/faker';
import { ICreateTicketInput } from '@/modules/tickets/domain/entities/ticket.entity';
import { ITicketClassification } from '@/shared/domain/ticket/ticket-classification.interface';
import { TicketChannel, TicketPriority } from '@/shared/domain/ticket/ticket.enums';

export function buildCreateTicketInput(overrides?: Partial<ICreateTicketInput>): ICreateTicketInput {
  return {
    userId: faker.string.uuid(),
    message: faker.lorem.paragraph(),
    ...overrides,
  };
}

export function buildTicketClassification(overrides?: Partial<ITicketClassification>): ITicketClassification {
  return {
    channel: TicketChannel.CUSTOMER_SERVICE,
    priority: TicketPriority.MEDIUM,
    manuallyReview: false,
    ...overrides,
  };
}
