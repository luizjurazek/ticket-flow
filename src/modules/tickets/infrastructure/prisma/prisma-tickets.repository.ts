import { PrismaClient } from '@prisma/client';
import { Ticket } from '@/modules/tickets/domain/entities/ticket.entity';
import { ITicketRepository } from '@/modules/tickets/domain/repositories/ticket.repository.interface';
import { TicketStatus } from '@/shared/domain/ticket/ticket.enums';

export class PrismaTicketsRepository implements ITicketRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(ticket: Ticket): Promise<Ticket> {
    const createdTicket = await this.prisma.ticket.create({
      data: {
        id: ticket.id,
        message: ticket.message,
        channel: ticket.channel,
        priority: ticket.priority,
        status: ticket.status,
        manuallyReview: ticket.manuallyReview,
        userId: ticket.userId,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
      },
    });

    return new Ticket(createdTicket);
  }

  async findById(id: string): Promise<Ticket | null> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) return null;

    return new Ticket(ticket);
  }

  async findByUserId(userId: string): Promise<Ticket[]> {
    const tickets = await this.prisma.ticket.findMany({
      where: { userId },
    });

    return tickets.map((ticket) => new Ticket(ticket));
  }

  async findAll(): Promise<Ticket[]> {
    const tickets = await this.prisma.ticket.findMany();

    return tickets.map((ticket) => new Ticket(ticket));
  }

  async updateStatus(id: string, status: TicketStatus): Promise<Ticket> {
    const updatedTicket = await this.prisma.ticket.update({
      where: { id },
      data: { status },
    });

    return new Ticket(updatedTicket);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.ticket.delete({
      where: { id },
    });
  }

  async existsByUserId(userId: string): Promise<boolean> {
    const count = await this.prisma.ticket.count({ where: { userId } });
    return count > 0;
  }
}
