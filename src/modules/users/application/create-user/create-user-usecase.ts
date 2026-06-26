import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { ICreateUserData, User } from '../../domain/entities/UserEntity';
import { AppError } from '../../../../shared/errors/AppError';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userData: ICreateUserData): Promise<User> {
    const userExists = await this.userRepository.findByEmail(userData.email);
    if (userExists) {
      throw new AppError('User already exists', 400);
    }

    const newUser = User.create(userData);

    await this.userRepository.create(newUser);
    return newUser;
  }
}
