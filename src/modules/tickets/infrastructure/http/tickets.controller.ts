import { Request, Response } from 'express';
import { CreateTicketUseCase } from '@/modules/tickets/applitcation/create-ticket/create-ticket.usecase';
import { HttpStatus } from '@/shared/http/http-status';

export class TicketsController {
  constructor(private readonly createTicketUseCase: CreateTicketUseCase) {}

  async create(req: Request, res: Response): Promise<Response | void> {
    const { userId, message } = req.body;
    const ticket = await this.createTicketUseCase.execute({ userId, message });

    return res.status(HttpStatus.CREATED).json(ticket);
  }
}
