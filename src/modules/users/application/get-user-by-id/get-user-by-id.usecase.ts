import { AppError } from '@/shared/errors/app-error';
import { IUserRepository } from '@/modules/users/domain/repositories/user.repository.interface';
import { UserOutputDTO } from '../dtos/user-output.dto';

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<UserOutputDTO> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);
    return UserOutputDTO.fromEntity(user);
  }
}
