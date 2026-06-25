import { Router, NextFunction } from 'express';
import { makeUserController } from './factories/UserControllerFactory';
import { validateDto } from '../../../../shared/infra/http/middlewares/validation.middleware';
import { CreateUserDTO } from '../../application/create-user/dto';

const userRoutes = Router();
const userController = makeUserController();

userRoutes.post('/', validateDto(CreateUserDTO), (req, res, next: NextFunction) => userController.create(req, res, next));
// userRoutes.get('/', (req, res, next: NextFunction) => userController.list(req, res, next));
// userRoutes.get("/:id", (req, res, next: NextFunction) => userController.getById(req, res, next));
userRoutes.put("/:id", (req, res, next: NextFunction) => userController.update(req, res, next));
// userRoutes.delete("/:id", (req, res, next: NextFunction) => userController.delete(req, res, next));

export { userRoutes };

