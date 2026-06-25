import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '../../application/create-user/CreateUserUseCase';
import { UpdateUserUseCase } from '../../application/update-user/UpdateUserUseCase';
import { GetUsersUseCase } from '../../application/get-users/GetUsersUseCase';
import { GetUserByIdUseCase } from '../../application/get-user-by-id/GetUserByIdUseCase';
import { DeleteUserUseCase } from '../../application/detete-user/DeleteUserUseCase';

export class UserController { 
  constructor(
    private readonly createUserUseCase: CreateUserUseCase, 
    private readonly updateUserUseCase: UpdateUserUseCase, 
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { name, email } = req.body;
      const user = await this.createUserUseCase.execute({ name, email });
      
      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async listById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const user = await this.getUserByIdUseCase.execute(req.params.id as string);
      
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const users = await this.getUsersUseCase.execute();
      
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { name, email } = req.body;
      const user = await this.updateUserUseCase.execute(req.params.id as string, { name, email });
      
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      await this.deleteUserUseCase.execute(req.params.id as string);
      
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}