import { CreateTicketUseCase } from './create-ticket.usecase';
import { InMemoryTicketRepository } from '@/modules/tickets/domain/repositories/fakes/in-memory-ticket.repository';
import { FakeClassifyTicketService } from '@/modules/tickets/domain/services/fakes/fake-classify-ticket.service';
import { UserLookupAdapter } from '@/modules/tickets/domain/services/adapters/user-lookup.adapter';
import { InMemoryUserRepository } from '@/modules/users/domain/repositories/fakes/in-memory-user.repository';
import { buildCreateTicketInput, buildTicketClassification } from '@/test/helpers/ticket.factory';
import { createUser } from '@/test/helpers/user.factory';
import { TicketChannel, TicketPriority, TicketStatus } from '@/shared/domain/ticket/ticket.enums';
import { HttpStatus } from '@/shared/http/http-status';

describe('CreateTicketUseCase', () => {
  let ticketRepository: InMemoryTicketRepository;
  let ticketClassifier: FakeClassifyTicketService;
  let userRepository: InMemoryUserRepository;
  let userLookup: UserLookupAdapter;
  let createTicketUseCase: CreateTicketUseCase;

  beforeEach(() => {
    ticketRepository = new InMemoryTicketRepository();
    ticketClassifier = new FakeClassifyTicketService();
    userRepository = new InMemoryUserRepository();
    userLookup = new UserLookupAdapter(userRepository);
    createTicketUseCase = new CreateTicketUseCase(ticketRepository, ticketClassifier, userLookup);
  });

  it('should create a ticket successfully', async () => {
    const user = await createUser(userRepository);
    const input = buildCreateTicketInput({ userId: user.id });
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
    const user = await createUser(userRepository);
    const input = buildCreateTicketInput({ userId: user.id });
    const classification = buildTicketClassification();
    ticketClassifier.setClassification(input.message, classification);

    const ticket = await createTicketUseCase.execute(input);
    const persistedTicket = await ticketRepository.findById(ticket.id);

    expect(persistedTicket).not.toBeNull();
    expect(persistedTicket?.message).toBe(input.message);
    expect(persistedTicket?.userId).toBe(input.userId);
  });

  it('should classify the ticket message before creating it', async () => {
    const user = await createUser(userRepository);
    const input = buildCreateTicketInput({ userId: user.id, message: 'My internet is not working' });

    await createTicketUseCase.execute(input);

    expect(ticketClassifier.getCalls()).toEqual(['My internet is not working']);
  });

  it('should throw when user does not exist', async () => {
    const input = buildCreateTicketInput();

    await expect(createTicketUseCase.execute(input)).rejects.toMatchObject({
      message: 'User not found',
      statusCode: HttpStatus.NOT_FOUND,
    });
    expect(ticketClassifier.getCalls()).toHaveLength(0);
  });
});
