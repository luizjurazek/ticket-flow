import { ITicketRepository } from '@/modules/tickets/domain/repositories/ticket.repository.interface';
import { TicketOutputDTO } from '@/modules/tickets/application/dtos/ticket-output.dto';

export class GetTicketsByUserUseCase {
  constructor(private readonly ticketRepository: ITicketRepository) {}

  async execute(userId: string): Promise<TicketOutputDTO[]> {
    const tickets = await this.ticketRepository.findByUserId(userId);
    return tickets.map((ticket) => TicketOutputDTO.fromEntity(ticket));
  }
}
