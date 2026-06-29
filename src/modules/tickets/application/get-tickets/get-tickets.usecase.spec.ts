import { InMemoryTicketRepository } from '@/modules/tickets/domain/repositories/fakes/in-memory-ticket.repository';
import { createTicket } from '@/test/helpers/ticket.factory';
import { GetTicketsUseCase } from './get-tickets.usecase';

describe('GetTicketsUseCase', () => {
  let getTicketsUseCase: GetTicketsUseCase;
  let ticketRepository: InMemoryTicketRepository;

  beforeEach(() => {
    ticketRepository = new InMemoryTicketRepository();
    getTicketsUseCase = new GetTicketsUseCase(ticketRepository);
  });

  it('should get all tickets successfully', async () => {
    const firstTicket = await createTicket(ticketRepository);
    const secondTicket = await createTicket(ticketRepository);

    const tickets = await getTicketsUseCase.execute();

    expect(tickets).toHaveLength(2);
    expect(tickets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: firstTicket.id,
          message: firstTicket.message,
          userId: firstTicket.userId,
        }),
        expect.objectContaining({
          id: secondTicket.id,
          message: secondTicket.message,
          userId: secondTicket.userId,
        }),
      ]),
    );
  });

  it('should return an empty array when there are no tickets', async () => {
    const tickets = await getTicketsUseCase.execute();

    expect(tickets).toEqual([]);
  });
});
