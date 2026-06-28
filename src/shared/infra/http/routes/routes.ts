import { Router } from 'express';
import { usersRoutes } from '@/modules/users/infrastructure/http/users.routes';
import { ticketsRoutes } from '@/modules/tickets/infrastructure/http/tickets.routes';

const globalRouter = Router();

globalRouter.use('/users', usersRoutes);
globalRouter.use('/tickets', ticketsRoutes);

export { globalRouter };
