import { ITicketRepository } from '@/modules/tickets/domain/repositories/ticket.repository.interface';
import { AppError } from '@/shared/errors/app-error';
import { HttpStatus } from '@/shared/utils/http-status';

export class DeleteTicketUseCase {
  constructor(private readonly ticketRepository: ITicketRepository) {}

  async execute(id: string): Promise<void> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) throw new AppError('Ticket not found', HttpStatus.NOT_FOUND);
    await this.ticketRepository.delete(id);
  }
}
