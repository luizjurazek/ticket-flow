import { CreateTicketUseCase } from './create-ticket.usecase';
import { InMemoryTicketRepository } from '@/modules/tickets/domain/repositories/fakes/in-memory-ticket.repository';
import { FakeClassifyTicketService } from '@/modules/tickets/domain/services/fakes/fake-classify-ticket.service';
import { buildCreateTicketInput, buildTicketClassification } from '@/test/helpers/ticket.factory';
import { TicketChannel, TicketPriority, TicketStatus } from '@/shared/domain/ticket/ticket.enums';

describe('CreateTicketUseCase', () => {
  let ticketRepository: InMemoryTicketRepository;
  let ticketClassifier: FakeClassifyTicketService;
  let createTicketUseCase: CreateTicketUseCase;

  beforeEach(() => {
    ticketRepository = new InMemoryTicketRepository();
    ticketClassifier = new FakeClassifyTicketService();
    createTicketUseCase = new CreateTicketUseCase(ticketRepository, ticketClassifier);
  });

  it('should create a ticket successfully', async () => {
    const input = buildCreateTicketInput();
    const classification = buildTicketClassification({
      channel: TicketChannel.TECHNICAL_SUPPORT,
      priority: TicketPriority.HIGH,
      manuallyReview: true,
    });
    ticketClassifier.setClassification(input.message, classification);

    const ticket = await createTicketUseCase.execute(input);

    expect(ticket.id).toBeDefined();
    expect(ticket.userId).toBe(input.userId);
    expect(ticket.message).toBe(input.message);
    expect(ticket.channel).toBe(classification.channel);
    expect(ticket.priority).toBe(classification.priority);
    expect(ticket.manuallyReview).toBe(classification.manuallyReview);
    expect(ticket.status).toBe(TicketStatus.OPEN);
  });

  it('should persist the created ticket in the repository', async () => {
    const input = buildCreateTicketInput();
    const classification = buildTicketClassification();
    ticketClassifier.setClassification(input.message, classification);

    const ticket = await createTicketUseCase.execute(input);
    const persistedTicket = await ticketRepository.findById(ticket.id);

    expect(persistedTicket).not.toBeNull();
    expect(persistedTicket?.message).toBe(input.message);
    expect(persistedTicket?.userId).toBe(input.userId);
  });

  it('should classify the ticket message before creating it', async () => {
    const input = buildCreateTicketInput({ message: 'My internet is not working' });

    await createTicketUseCase.execute(input);

    expect(ticketClassifier.getCalls()).toEqual(['My internet is not working']);
  });
});
