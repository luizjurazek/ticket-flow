import { Router, NextFunction } from 'express';
import { makeUsersController } from '@/modules/users/infrastructure/http/users/factories/users.controller.factory';
import { validateDto, validateRequest } from '@/shared/infra/http/middlewares/validation.middleware';
import { IdParamDTO } from '@/shared/infra/http/dtos/id-param.dto';
import { CreateUserInputDTO } from '@/modules/users/application/create-user/dto';
import { UpdateUserDTO } from '@/modules/users/application/update-user/dto';

const usersRoutes = Router();
const usersController = makeUsersController();

usersRoutes.post('/', validateDto(CreateUserInputDTO), (req, res, next: NextFunction) =>
  usersController.create(req, res, next),
);
usersRoutes.get('/:id', validateDto(IdParamDTO, 'params'), (req, res, next: NextFunction) =>
  usersController.listById(req, res, next),
);
usersRoutes.get('/', (req, res, next: NextFunction) => usersController.list(req, res, next));
usersRoutes.put('/:id', validateRequest({ params: IdParamDTO, body: UpdateUserDTO }), (req, res, next: NextFunction) =>
  usersController.update(req, res, next),
);
usersRoutes.delete('/:id', validateDto(IdParamDTO, 'params'), (req, res, next: NextFunction) =>
  usersController.delete(req, res, next),
);

export { usersRoutes };
