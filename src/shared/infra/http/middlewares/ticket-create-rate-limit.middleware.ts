import { HttpStatus } from '@/shared/http/http-status';
import { AppError } from '@/shared/errors/app-error';
import rateLimit from 'express-rate-limit';

const TICKET_CREATE_RATE_LIMIT_MAX = process.env.TICKET_CREATE_RATE_LIMIT_MAX
  ? parseInt(process.env.TICKET_CREATE_RATE_LIMIT_MAX)
  : 10;
const TICKET_CREATE_RATE_LIMIT_WINDOW_MS = process.env.TICKET_CREATE_RATE_LIMIT_WINDOW_MS
  ? parseInt(process.env.TICKET_CREATE_RATE_LIMIT_WINDOW_MS)
  : 30_000;

export const ticketCreateRateLimit = rateLimit({
  windowMs: TICKET_CREATE_RATE_LIMIT_WINDOW_MS,
  max: TICKET_CREATE_RATE_LIMIT_MAX,
  message: new AppError('Too many requests', HttpStatus.TOO_MANY_REQUESTS),
});
