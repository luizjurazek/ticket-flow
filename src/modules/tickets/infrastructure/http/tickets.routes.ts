import { Router } from 'express';
import { makeTicketsController } from './factories/tickets.controller.factory';
import { validateDto } from '@/shared/infra/http/middlewares/validation.middleware';
import { CreateTicketInputDTO } from './dtos/create-ticket-input.dto';

const ticketsRoutes = Router();
const ticketsController = makeTicketsController();

ticketsRoutes.post('/', validateDto(CreateTicketInputDTO), (req, res) => ticketsController.create(req, res));

export { ticketsRoutes };
