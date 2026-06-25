import { Router, NextFunction } from 'express';
import { makeUserController } from './factories/UserControllerFactory';
import { validateDto } from '../../../../shared/infra/http/middlewares/validation.middleware';
import { CreateUserDTO } from '../../application/create-user/dto';

const userRoutes = Router();
const userController = makeUserController();

userRoutes.post('/', validateDto(CreateUserDTO), (req, res, next: NextFunction) => userController.create(req, res, next));

export { userRoutes };

