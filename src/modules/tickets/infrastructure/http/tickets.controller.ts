import { Request, Response } from 'express';
import { CreateTicketUseCase } from '@/modules/tickets/application/create-ticket/create-ticket.usecase';
import { HttpStatus } from '@/shared/http/http-status';

import { ApiOperation, ApiTags, ApiRoute, ApiBody, ApiResponse } from '@swagger/decorators';
import { CreateTicketInputDTO } from './dtos/create-ticket-input.dto';
import { TicketOutputDTO } from '@/modules/tickets/application/dtos/ticket-output.dto';
@ApiTags('Tickets')
export class TicketsController {
  constructor(private readonly createTicketUseCase: CreateTicketUseCase) {}

  @ApiRoute({
    method: 'post',
    path: '/tickets',
  })
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user with the given name and email',
  })
  @ApiResponse({
    statusCode: HttpStatus.CREATED,
    description: 'Ticket created successfully',
    type: TicketOutputDTO,
  })
  @ApiBody({
    type: CreateTicketInputDTO,
    description: 'Ticket data',
  })
  async create(req: Request, res: Response): Promise<Response | void> {
    const { userId, message } = req.body;
    const ticket = await this.createTicketUseCase.execute({ userId, message });

    return res.status(HttpStatus.CREATED).json(ticket);
  }
}
