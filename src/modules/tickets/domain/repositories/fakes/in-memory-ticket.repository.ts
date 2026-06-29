import { ITicketRepository } from '@/modules/tickets/domain/repositories/ticket.repository.interface';
import { Ticket } from '@/modules/tickets/domain/entities/ticket.entity';
import { TicketStatus } from '@/shared/domain/ticket/ticket.enums';
import { AppError } from '@/shared/errors/app-error';
import { HttpStatus } from '@/shared/http/http-status';

export class InMemoryTicketRepository implements ITicketRepository {
  private tickets: Ticket[] = [];

  async create(ticket: Ticket): Promise<Ticket> {
    this.tickets.push(ticket);
    return ticket;
  }

  async findById(id: string): Promise<Ticket | null> {
    return this.tickets.find((ticket) => ticket.id === id) ?? null;
  }

  async findByUserId(userId: string): Promise<Ticket[]> {
    return this.tickets.filter((ticket) => ticket.userId === userId);
  }

  async findAll(): Promise<Ticket[]> {
    return this.tickets;
  }

  async updateStatus(id: string, status: TicketStatus): Promise<Ticket> {
    const ticket = await this.findById(id);
    if (!ticket) {
      throw new AppError('Ticket not found', HttpStatus.NOT_FOUND);
    }
    ticket.updateStatus(status);
    return ticket;
  }

  async delete(id: string): Promise<void> {
    this.tickets = this.tickets.filter((ticket) => ticket.id !== id);
  }
}
