import { ITicketRepository } from '@/modules/tickets/domain/repositories/ticket.repository.interface';
import { TicketOutputDTO } from '@/modules/tickets/application/dtos/ticket-output.dto';
import { AppError } from '@/shared/errors/app-error';
import { HttpStatus } from '@/shared/http/http-status';

export class GetTicketsByUserUseCase {
  constructor(private readonly ticketRepository: ITicketRepository) {}

  async execute(userId: string): Promise<TicketOutputDTO[]> {
    const tickets = await this.ticketRepository.findByUserId(userId);
    if (!tickets) throw new AppError('Tickets not found', HttpStatus.NOT_FOUND);
    return tickets.map((ticket) => TicketOutputDTO.fromEntity(ticket));
  }
}
