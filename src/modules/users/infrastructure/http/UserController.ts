import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '../../application/create-user/CreateUserUseCase';
import { UpdateUserUseCase } from '../../application/update-user/UpdateUserUseCase';

export class UserController { 
  constructor(private readonly createUserUseCase: CreateUserUseCase, private readonly updateUserUseCase: UpdateUserUseCase) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { name, email } = req.body;
      const user = await this.createUserUseCase.execute({ name, email });
      
      return res.status(201).json(user);
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
}