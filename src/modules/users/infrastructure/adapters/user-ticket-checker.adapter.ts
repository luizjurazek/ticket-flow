import { IUserTicketChecker } from '@/modules/users/domain/services/user-ticket-checker.interface';
import { ITicketRepository } from '@/modules/tickets/domain/repositories/ticket.repository.interface';

export class UserTicketCheckerAdapter implements IUserTicketChecker {
  constructor(private readonly ticketRepository: ITicketRepository) {}

  async hasTicketsByUserId(userId: string): Promise<boolean> {
    return await this.ticketRepository.existsByUserId(userId);
  }
}
