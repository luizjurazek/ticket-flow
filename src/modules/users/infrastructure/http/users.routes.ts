import { Router, NextFunction } from 'express';
import { makeUsersController } from '@/modules/users/infrastructure/http/factories/users.controller.factory';
import { validateDto, validateRequest } from '@/shared/infra/http/middlewares/validation.middleware';
import { IdParamDTO } from '@/shared/infra/http/dtos/id-param.dto';
import { CreateUserInputDTO } from '@/modules/users/infrastructure/http/dtos/create-user-input.dto';
import { UpdateUserInputDTO } from '@/modules/users/infrastructure/http/dtos/update-user-input.dto';

const usersRoutes = Router();
const usersController = makeUsersController();

usersRoutes.post('/', validateDto(CreateUserInputDTO), (req, res) => usersController.create(req, res));
usersRoutes.get('/', (req, res) => usersController.findAll(req, res));
usersRoutes.get('/:id', validateDto(IdParamDTO, 'params'), (req, res) => usersController.findById(req, res));
usersRoutes.put('/:id', validateRequest({ params: IdParamDTO, body: UpdateUserInputDTO }), (req, res) =>
  usersController.update(req, res),
);
usersRoutes.delete('/:id', validateDto(IdParamDTO, 'params'), (req, res) => usersController.delete(req, res));

export { usersRoutes };
