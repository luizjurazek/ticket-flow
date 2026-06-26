import { Router, NextFunction } from 'express';
import { makeUserController } from './factories/user.controller.factory';
import { validateDto } from '../../../../shared/infra/http/middlewares/validation.middleware';
import { CreateUserDTO } from '../../application/create-user/dto';
import { UpdateUserDTO } from '../../application/update-user/dto';

const userRoutes = Router();
const userController = makeUserController();

userRoutes.post('/', validateDto(CreateUserDTO), (req, res, next: NextFunction) =>
  userController.create(req, res, next),
);
userRoutes.get('/:id', (req, res, next: NextFunction) => userController.listById(req, res, next));
userRoutes.get('/', (req, res, next: NextFunction) => userController.list(req, res, next));
userRoutes.put('/:id', validateDto(UpdateUserDTO), (req, res, next: NextFunction) =>
  userController.update(req, res, next),
);
userRoutes.delete('/:id', (req, res, next: NextFunction) => userController.delete(req, res, next));

export { userRoutes };
