import { DeleteTicketUseCase } from './delete-ticket.usecase';
import { InMemoryTicketRepository } from '@/modules/tickets/domain/repositories/fakes/in-memory-ticket.repository';
import { HttpStatus } from '@/shared/utils/http-status';
import { createTicket } from '@/test/helpers/ticket.factory';

describe('DeleteTicketUseCase', () => {
  let ticketRepository: InMemoryTicketRepository;
  let deleteTicketUseCase: DeleteTicketUseCase;

  beforeEach(() => {
    ticketRepository = new InMemoryTicketRepository();
    deleteTicketUseCase = new DeleteTicketUseCase(ticketRepository);
  });

  it('should delete a ticket successfully', async () => {
    const ticket = await createTicket(ticketRepository);
    await deleteTicketUseCase.execute(ticket.id);
    const deletedTicket = await ticketRepository.findById(ticket.id);
    expect(deletedTicket).toBeNull();
  });

  it('should throw error when ticket is not found', async () => {
    await expect(deleteTicketUseCase.execute('non-existent-id')).rejects.toMatchObject({
      message: 'Ticket not found',
      statusCode: HttpStatus.NOT_FOUND,
    });
  });

  it('should not delete other tickets when deleting one ticket', async () => {
    const firstTicket = await createTicket(ticketRepository);
    const secondTicket = await createTicket(ticketRepository);
    await deleteTicketUseCase.execute(firstTicket.id);
    const remainingTicket = await ticketRepository.findById(secondTicket.id);
    expect(remainingTicket).not.toBeNull();
    expect(remainingTicket?.id).toBe(secondTicket.id);
  });
});
