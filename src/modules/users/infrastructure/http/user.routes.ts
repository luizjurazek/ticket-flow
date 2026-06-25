import { Router } from 'express';
import { makeUserController } from './factories/UserControllerFactory';
import { validateDto } from '../../../../shared/infra/http/middlewares/validation.middleware';
import { CreateUserDTO } from '../../application/create-user/dto';

const userRoutes = Router();
const userController = makeUserController();

userRoutes.post('/', validateDto(CreateUserDTO), (req, res) => userController.create(req, res));

export { userRoutes };

