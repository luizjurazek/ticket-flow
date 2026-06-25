import { Router } from 'express';
import { userRoutes } from '../../../../modules/users/infrastructure/http/user.routes';

const globalRouter = Router();

globalRouter.use('/users', userRoutes);

export { globalRouter };
