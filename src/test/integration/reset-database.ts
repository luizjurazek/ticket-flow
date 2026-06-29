import { pool, prisma } from '@/shared/database/prisma';

export async function resetDatabase(): Promise<void> {
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
}
