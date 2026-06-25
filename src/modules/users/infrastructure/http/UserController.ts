import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/create-user/CreateUserUseCase';

export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email } = req.body;
      const user = await this.createUserUseCase.execute({ name, email });
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}