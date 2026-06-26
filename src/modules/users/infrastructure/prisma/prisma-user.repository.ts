import { PrismaClient, Prisma } from '@prisma/client';
import { User } from '@/modules/users/domain/entities/user.entity';
import { IUserRepository } from '@/modules/users/domain/repositories/user.repository.interface';
import { Ticket } from '@/modules/tickets/domain/ticket.entity';

type PrismaUserWithTickets = Prisma.UserGetPayload<{
  include: { tickets: true };
}>;

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    return new User(createdUser);
  }

  async update(user: User): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        updatedAt: user.updatedAt,
      },
    });

    return new User(updatedUser);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { tickets: true },
    });

    if (!user) return null;

    return this.mapToEntity(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new User(user));
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { tickets: true },
    });

    if (!user) return null;

    return this.mapToEntity(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  private mapToEntity(prismaUser: PrismaUserWithTickets): User {
    const tickets = prismaUser.tickets.map(
      (t) => new Ticket(t.id, t.message, t.channel, t.priority, t.status, t.userId, t.createdAt, t.updatedAt),
    );

    return new User(prismaUser);
  }
}
