import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '@/shared/http/http-status';
import { CreateUserUseCase } from '@/modules/users/application/create-user/create-user.usecase';
import { UpdateUserUseCase } from '@/modules/users/application/update-user/update-user.usecase';
import { GetUsersUseCase } from '@/modules/users/application/get-users/get-users.usecase';
import { GetUserByIdUseCase } from '@/modules/users/application/get-user-by-id/get-user-by-id.usecase';
import { DeleteUserUseCase } from '@/modules/users/application/delete-user/delete-user.usecase';

export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { name, email } = req.body;
      const user = await this.createUserUseCase.execute({ name, email });

      return res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      next(error);
    }
  }

  async listById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const user = await this.getUserByIdUseCase.execute(req.params.id as string);

      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const users = await this.getUsersUseCase.execute();

      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { name, email } = req.body;
      const user = await this.updateUserUseCase.execute(req.params.id as string, { name, email });

      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      await this.deleteUserUseCase.execute(req.params.id as string);

      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}
