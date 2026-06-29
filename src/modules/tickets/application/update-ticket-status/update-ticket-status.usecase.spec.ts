import { InMemoryTicketRepository } from '@/modules/tickets/domain/repositories/fakes/in-memory-ticket.repository';
import { HttpStatus } from '@/shared/utils/http-status';
import { TicketStatus } from '@/shared/domain/ticket/ticket.enums';
import { createTicket } from '@/test/helpers/ticket.factory';
import { UpdateTicketStatusUseCase } from './update-ticket-status.usecase';

describe('UpdateTicketStatusUseCase', () => {
  let ticketRepository: InMemoryTicketRepository;
  let updateTicketStatusUseCase: UpdateTicketStatusUseCase;

  beforeEach(() => {
    ticketRepository = new InMemoryTicketRepository();
    updateTicketStatusUseCase = new UpdateTicketStatusUseCase(ticketRepository);
  });

  it('should update ticket status successfully', async () => {
    const ticket = await createTicket(ticketRepository);

    const updatedTicket = await updateTicketStatusUseCase.execute(ticket.id, TicketStatus.IN_PROGRESS);

    expect(updatedTicket.id).toBe(ticket.id);
    expect(updatedTicket.status).toBe(TicketStatus.IN_PROGRESS);
  });

  it('should persist updated status in the repository', async () => {
    const ticket = await createTicket(ticketRepository);

    await updateTicketStatusUseCase.execute(ticket.id, TicketStatus.CLOSED);

    const persistedTicket = await ticketRepository.findById(ticket.id);
    expect(persistedTicket?.status).toBe(TicketStatus.CLOSED);
  });

  it('should throw error when ticket is not found', async () => {
    await expect(updateTicketStatusUseCase.execute('non-existent-id', TicketStatus.CLOSED)).rejects.toMatchObject({
      message: 'Ticket not found',
      statusCode: HttpStatus.NOT_FOUND,
    });
  });

  it('should throw error when ticket already has this status', async () => {
    const ticket = await createTicket(ticketRepository);
    await updateTicketStatusUseCase.execute(ticket.id, TicketStatus.IN_PROGRESS);

    await expect(updateTicketStatusUseCase.execute(ticket.id, TicketStatus.IN_PROGRESS)).rejects.toMatchObject({
      message: 'Ticket already has this status',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  });
});
