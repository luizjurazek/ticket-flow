import { AppError } from '@/shared/errors/AppError';
import { IUserRepository } from '@/modules/users/domain/repositories/user.repository.interface';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);
    await this.userRepository.delete(id);
  }
}
