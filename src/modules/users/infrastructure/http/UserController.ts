import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '../../application/create-user/CreateUserUseCase';

export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { name, email } = req.body;
      const user = await this.createUserUseCase.execute({ name, email });
      
      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
}