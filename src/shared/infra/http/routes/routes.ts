import { Router } from 'express';
import { usersRoutes } from '@/modules/users/infrastructure/http/users/users.routes';

const globalRouter = Router();

globalRouter.use('/users', usersRoutes);

export { globalRouter };
