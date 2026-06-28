import { Ticket } from '@/modules/tickets/domain/entities/ticket.entity';
import { TicketStatus } from '@/shared/domain/ticket/ticket.enums';

export interface ITicketRepository {
  create(ticket: Ticket): Promise<Ticket>;
  findById(id: string): Promise<Ticket | null>;
  findByUserId(userId: string): Promise<Ticket[]>;
  findAll(): Promise<Ticket[]>;
  updateStatus(id: string, status: TicketStatus): Promise<Ticket>;
  delete(id: string): Promise<void>;
}
