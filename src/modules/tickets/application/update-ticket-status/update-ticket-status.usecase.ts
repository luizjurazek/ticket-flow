import { ITicketRepository } from '@/modules/tickets/domain/repositories/ticket.repository.interface';
import { TicketOutputDTO } from '@/modules/tickets/application/dtos/ticket-output.dto';
import { AppError } from '@/shared/errors/app-error';
import { HttpStatus } from '@/shared/utils/http-status';
import { TicketStatus } from '@/shared/domain/ticket/ticket.enums';

export class UpdateTicketStatusUseCase {
  constructor(private readonly ticketRepository: ITicketRepository) {}

  async execute(id: string, status: TicketStatus): Promise<TicketOutputDTO> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) throw new AppError('Ticket not found', HttpStatus.NOT_FOUND);
    if (ticket.status === status) throw new AppError('Ticket already has this status', HttpStatus.BAD_REQUEST);

    ticket.updateStatus(status);
    await this.ticketRepository.updateStatus(id, status);

    return TicketOutputDTO.fromEntity(ticket);
  }
}
