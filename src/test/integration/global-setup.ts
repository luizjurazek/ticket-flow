import dotenv from 'dotenv';
import { execSync } from 'child_process';
export default function globalSetup(): void {
  dotenv.config({ path: '.env.test' });
  execSync('npx prisma migrate deploy', { env: process.env, stdio: 'inherit' });
}
