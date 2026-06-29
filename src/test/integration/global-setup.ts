import dotenv from 'dotenv';
import { execSync } from 'child_process';

export default function globalSetup(): void {
  dotenv.config({ path: '.env.test', quiet: true });
  execSync('npx prisma migrate deploy', { env: process.env, stdio: 'pipe' });
}
