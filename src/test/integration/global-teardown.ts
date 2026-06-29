import dotenv from 'dotenv';
import { pool, prisma } from '../../shared/database/prisma';

export default async function globalTeardown(): Promise<void> {
  dotenv.config({ path: '.env.test', quiet: true });
  await prisma.$disconnect();
  await pool.end();
}
