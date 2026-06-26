import { Router, NextFunction } from 'express';
import { makeUsersController } from '@/modules/users/infrastructure/http/factories/users.controller.factory';
import { validateDto, validateRequest } from '@/shared/infra/http/middlewares/validation.middleware';
import { IdParamDTO } from '@/shared/infra/http/dtos/id-param.dto';
import { CreateUserInputDTO } from '@/modules/users/infrastructure/http/dtos/create-user-input.dto';
import { UpdateUserInputDTO } from '@/modules/users/infrastructure/http/dtos/update-user-input.dto';

const usersRoutes = Router();
const usersController = makeUsersController();

usersRoutes.post('/', validateDto(CreateUserInputDTO), (req, res, next: NextFunction) =>
  usersController.create(req, res, next),
);
usersRoutes.get('/', (req, res, next: NextFunction) => usersController.findAll(req, res, next));
usersRoutes.get('/:id', validateDto(IdParamDTO, 'params'), (req, res, next: NextFunction) =>
  usersController.findById(req, res, next),
);
usersRoutes.put(
  '/:id',
  validateRequest({ params: IdParamDTO, body: UpdateUserInputDTO }),
  (req, res, next: NextFunction) => usersController.update(req, res, next),
);
usersRoutes.delete('/:id', validateDto(IdParamDTO, 'params'), (req, res, next: NextFunction) =>
  usersController.delete(req, res, next),
);

export { usersRoutes };
