import { Router } from 'express';
import { makeTicketsController } from './factories/tickets.controller.factory';
import { validateDto, validateRequest } from '@/shared/infra/http/middlewares/validation.middleware';
import { CreateTicketInputDTO } from './dtos/create-ticket-input.dto';
import { IdParamDTO } from '@/shared/infra/http/dtos/id-param.dto';
import { UpdateTicketStatusInputDTO } from './dtos/update-ticket-status-input.dto';
import { ticketCreateRateLimit } from '@/shared/infra/http/middlewares/ticket-create-rate-limit.middleware';

const ticketsRoutes = Router();
const ticketsController = makeTicketsController();

ticketsRoutes.post('/', ticketCreateRateLimit, validateDto(CreateTicketInputDTO), (req, res) =>
  ticketsController.create(req, res),
);
ticketsRoutes.get('/', (req, res) => ticketsController.findAll(req, res));
ticketsRoutes.get('/user/:id', validateDto(IdParamDTO, 'params'), (req, res) =>
  ticketsController.getByUserId(req, res),
);
ticketsRoutes.get('/:id', validateDto(IdParamDTO, 'params'), (req, res) => ticketsController.getById(req, res));
ticketsRoutes.put(
  '/:id/status',
  validateRequest({ params: IdParamDTO, body: UpdateTicketStatusInputDTO }),
  (req, res) => ticketsController.updateStatus(req, res),
);
ticketsRoutes.delete('/:id', validateDto(IdParamDTO, 'params'), (req, res) => ticketsController.delete(req, res));

export { ticketsRoutes };
