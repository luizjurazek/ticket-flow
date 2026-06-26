import { IUserRepository } from '@/modules/users/domain/repositories/user.repository.interface';
import { ICreateUserData, User } from '@/modules/users/domain/entities/user.entity';
import { AppError } from '@/shared/errors/app-error';
import { UserOutputDTO } from '../dtos/user-output.dto';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userData: ICreateUserData): Promise<UserOutputDTO> {
    const userExists = await this.userRepository.findByEmail(userData.email);
    if (userExists) {
      throw new AppError('User already exists', 400);
    }

    const newUser = User.create(userData);

    await this.userRepository.create(newUser);
    return UserOutputDTO.fromEntity(newUser);
  }
}
