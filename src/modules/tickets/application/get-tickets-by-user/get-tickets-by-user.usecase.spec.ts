import { faker } from '@faker-js/faker';
import { InMemoryTicketRepository } from '@/modules/tickets/domain/repositories/fakes/in-memory-ticket.repository';
import { createTicket } from '@/test/helpers/ticket.factory';
import { GetTicketsByUserUseCase } from './get-tickets-by-user.usecase';

describe('GetTicketsByUserUseCase', () => {
  let ticketRepository: InMemoryTicketRepository;
  let getTicketsByUserUseCase: GetTicketsByUserUseCase;

  beforeEach(() => {
    ticketRepository = new InMemoryTicketRepository();
    getTicketsByUserUseCase = new GetTicketsByUserUseCase(ticketRepository);
  });

  it('should get tickets by user id successfully', async () => {
    const userId = faker.string.uuid();
    const otherUserId = faker.string.uuid();
    const firstTicket = await createTicket(ticketRepository, { userId });
    const secondTicket = await createTicket(ticketRepository, { userId });
    await createTicket(ticketRepository, { userId: otherUserId });

    const tickets = await getTicketsByUserUseCase.execute(userId);

    expect(tickets).toHaveLength(2);
    expect(tickets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: firstTicket.id,
          userId,
          message: firstTicket.message,
        }),
        expect.objectContaining({
          id: secondTicket.id,
          userId,
          message: secondTicket.message,
        }),
      ]),
    );
  });

  it('should return an empty array when user has no tickets', async () => {
    const tickets = await getTicketsByUserUseCase.execute(faker.string.uuid());

    expect(tickets).toEqual([]);
  });
});
