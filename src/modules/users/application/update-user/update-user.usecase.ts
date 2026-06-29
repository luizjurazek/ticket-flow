import { IUpdateUserData } from '@/modules/users/domain/entities/user.entity';
import { IUserRepository } from '@/modules/users/domain/repositories/user.repository.interface';
import { AppError } from '@/shared/errors/app-error';
import { HttpStatus } from '@/shared/utils/http-status';
import { UserOutputDTO } from '../dtos/user-output.dto';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, data: IUpdateUserData): Promise<UserOutputDTO> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('User not found', HttpStatus.NOT_FOUND);

    if (data.email && data.email !== user.email) {
      const userWithEmail = await this.userRepository.findByEmail(data.email);
      if (userWithEmail) {
        throw new AppError('Email already exists', HttpStatus.BAD_REQUEST);
      }
    }

    user.update(data);
    await this.userRepository.update(user);

    return UserOutputDTO.fromEntity(user);
  }
}
