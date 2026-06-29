import { ITicketRepository } from '@/modules/tickets/domain/repositories/ticket.repository.interface';
import { TicketOutputDTO } from '@/modules/tickets/application/dtos/ticket-output.dto';

export class GetTicketsUseCase {
  constructor(private readonly ticketRepository: ITicketRepository) {}

  async execute(): Promise<TicketOutputDTO[]> {
    const tickets = await this.ticketRepository.findAll();
    return tickets.map((ticket) => TicketOutputDTO.fromEntity(ticket));
  }
}
