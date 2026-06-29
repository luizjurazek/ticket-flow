import { GetTicketByIdUseCase } from './get-ticket-by-id.usecase';
import { InMemoryTicketRepository } from '@/modules/tickets/domain/repositories/fakes/in-memory-ticket.repository';
import { HttpStatus } from '@/shared/utils/http-status';
import { createTicket } from '@/test/helpers/ticket.factory';

describe('GetTicketByIdUseCase', () => {
  let ticketRepository: InMemoryTicketRepository;
  let getTicketByIdUseCase: GetTicketByIdUseCase;

  beforeEach(() => {
    ticketRepository = new InMemoryTicketRepository();
    getTicketByIdUseCase = new GetTicketByIdUseCase(ticketRepository);
  });

  it('should get a ticket by id successfully', async () => {
    const ticket = await createTicket(ticketRepository);

    const ticketById = await getTicketByIdUseCase.execute(ticket.id);

    expect(ticketById.id).toBe(ticket.id);
    expect(ticketById.message).toBe(ticket.message);
    expect(ticketById.userId).toBe(ticket.userId);
    expect(ticketById.channel).toBe(ticket.channel);
    expect(ticketById.priority).toBe(ticket.priority);
    expect(ticketById.status).toBe(ticket.status);
  });

  it('should throw error when ticket is not found', async () => {
    await expect(getTicketByIdUseCase.execute('non-existent-id')).rejects.toMatchObject({
      message: 'Ticket not found',
      statusCode: HttpStatus.NOT_FOUND,
    });
  });
});
