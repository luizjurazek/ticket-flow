import { Request, Response } from 'express';
import { CreateTicketUseCase } from '@/modules/tickets/application/create-ticket/create-ticket.usecase';
import { HttpStatus } from '@/shared/utils/http-status';
import { ApiOperation, ApiTags, ApiRoute, ApiBody, ApiResponse, ApiParams } from '@swagger/decorators';
import { CreateTicketInputDTO } from '@/modules/tickets/infrastructure/http/dtos/create-ticket-input.dto';
import { TicketOutputDTO } from '@/modules/tickets/application/dtos/ticket-output.dto';
import { GetTicketByIdUseCase } from '@/modules/tickets/application/get-ticket-by-id/get-ticket-by-id.usecase';
import { GetTicketsUseCase } from '@/modules/tickets/application/get-tickets/get-tickets.usecase';
import { GetTicketsByUserUseCase } from '@/modules/tickets/application/get-tickets-by-user/get-tickets-by-user.usecase';
import { UpdateTicketStatusUseCase } from '@/modules/tickets/application/update-ticket-status/update-ticket-status.usecase';
import { UpdateTicketStatusInputDTO } from './dtos/update-ticket-status-input.dto';

@ApiTags('Tickets')
export class TicketsController {
  constructor(
    private readonly createTicketUseCase: CreateTicketUseCase,
    private readonly getTicketsUseCase: GetTicketsUseCase,
    private readonly getTicketByIdUseCase: GetTicketByIdUseCase,
    private readonly getTicketsByUserUseCase: GetTicketsByUserUseCase,
    private readonly updateTicketStatusUseCase: UpdateTicketStatusUseCase,
  ) {}

  @ApiRoute({
    method: 'post',
    path: '/tickets',
  })
  @ApiOperation({
    summary: 'Create a ticket',
    description: 'Creates a new ticket with the given message and user ID',
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

  @ApiRoute({
    method: 'get',
    path: '/tickets',
  })
  @ApiOperation({
    summary: 'Get all tickets',
    description: 'Gets all tickets',
  })
  @ApiResponse({
    statusCode: HttpStatus.OK,
    description: 'Tickets found successfully',
    type: TicketOutputDTO,
    isArray: true,
  })
  async findAll(req: Request, res: Response): Promise<Response | void> {
    const tickets = await this.getTicketsUseCase.execute();
    return res.status(HttpStatus.OK).json(tickets);
  }

  @ApiRoute({
    method: 'get',
    path: '/tickets/{id}',
  })
  @ApiOperation({
    summary: 'Get a ticket by ID',
    description: 'Gets a ticket by their ID',
  })
  @ApiResponse({
    statusCode: HttpStatus.OK,
    description: 'Ticket found successfully',
    type: TicketOutputDTO,
  })
  @ApiParams({
    name: 'id',
    in: 'path',
    description: 'Ticket ID',
    required: true,
    type: 'string',
  })
  async getById(req: Request, res: Response): Promise<Response | void> {
    const ticket = await this.getTicketByIdUseCase.execute(req.params.id as string);
    return res.status(HttpStatus.OK).json(ticket);
  }

  @ApiRoute({
    method: 'get',
    path: '/tickets/user/{id}',
  })
  @ApiOperation({
    summary: 'Get tickets by user ID',
    description: 'Gets tickets by user ID',
  })
  @ApiResponse({
    statusCode: HttpStatus.OK,
    description: 'Tickets found successfully',
    type: TicketOutputDTO,
    isArray: true,
  })
  @ApiParams({
    name: 'userId',
    in: 'path',
    description: 'User ID',
    required: true,
    type: 'string',
  })
  async getByUserId(req: Request, res: Response): Promise<Response | void> {
    const tickets = await this.getTicketsByUserUseCase.execute(req.params.id as string);
    return res.status(HttpStatus.OK).json(tickets);
  }

  @ApiRoute({
    method: 'put',
    path: '/tickets/{id}/status',
  })
  @ApiOperation({
    summary: 'Update ticket status',
    description: 'Updates a ticket status by their ID',
  })
  @ApiResponse({
    statusCode: HttpStatus.OK,
    description: 'Ticket status updated successfully',
    type: TicketOutputDTO,
  })
  @ApiParams({
    name: 'id',
    in: 'path',
    description: 'Ticket ID',
    required: true,
    type: 'string',
  })
  @ApiBody({
    type: UpdateTicketStatusInputDTO,
    description: 'Ticket status',
  })
  async updateStatus(req: Request, res: Response): Promise<Response | void> {
    const { status } = req.body;
    const ticket = await this.updateTicketStatusUseCase.execute(req.params.id as string, status);
    return res.status(HttpStatus.OK).json(ticket);
  }
}
