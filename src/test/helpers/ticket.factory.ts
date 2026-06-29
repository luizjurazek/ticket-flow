import { faker } from '@faker-js/faker';
import { ICreateTicketData, ICreateTicketInput, Ticket } from '@/modules/tickets/domain/entities/ticket.entity';
import { InMemoryTicketRepository } from '@/modules/tickets/domain/repositories/fakes/in-memory-ticket.repository';
import { ITicketClassification } from '@/shared/domain/ticket/ticket-classification.interface';
import { TicketChannel, TicketPriority } from '@/shared/domain/ticket/ticket.enums';

export function buildCreateTicketInput(overrides?: Partial<ICreateTicketInput>): ICreateTicketInput {
  return {
    userId: faker.string.uuid(),
    message: faker.lorem.paragraph(),
    ...overrides,
  };
}

export function buildTicketData(overrides?: Partial<ICreateTicketData>): ICreateTicketData {
  return {
    userId: faker.string.uuid(),
    message: faker.lorem.paragraph(),
    channel: TicketChannel.CUSTOMER_SERVICE,
    priority: TicketPriority.MEDIUM,
    manuallyReview: false,
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

export async function createTicket(
  ticketRepository: InMemoryTicketRepository,
  overrides?: Partial<ICreateTicketData>,
): Promise<Ticket> {
  return ticketRepository.create(Ticket.create(buildTicketData(overrides)));
}
