import { Router } from 'express';
import { makeTicketsController } from './factories/tickets.controller.factory';
import { validateDto } from '@/shared/infra/http/middlewares/validation.middleware';
import { CreateTicketInputDTO } from './dtos/create-ticket-input.dto';
import { IdParamDTO } from '@/shared/infra/http/dtos/id-param.dto';

const ticketsRoutes = Router();
const ticketsController = makeTicketsController();

ticketsRoutes.post('/', validateDto(CreateTicketInputDTO), (req, res) => ticketsController.create(req, res));
ticketsRoutes.get('/', (req, res) => ticketsController.findAll(req, res));
ticketsRoutes.get('/:id', validateDto(IdParamDTO, 'params'), (req, res) => ticketsController.getById(req, res));

export { ticketsRoutes };
