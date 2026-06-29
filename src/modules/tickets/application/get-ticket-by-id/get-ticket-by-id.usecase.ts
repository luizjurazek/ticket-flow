import { ITicketRepository } from '@/modules/tickets/domain/repositories/ticket.repository.interface';
import { TicketOutputDTO } from '@/modules/tickets/application/dtos/ticket-output.dto';
import { AppError } from '@/shared/errors/app-error';
import { HttpStatus } from '@/shared/utils/http-status';

export class GetTicketByIdUseCase {
  constructor(private readonly ticketRepository: ITicketRepository) {}

  async execute(id: string): Promise<TicketOutputDTO> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) throw new AppError('Ticket not found', HttpStatus.NOT_FOUND);
    return TicketOutputDTO.fromEntity(ticket);
  }
}
