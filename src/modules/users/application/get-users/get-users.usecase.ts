import { IUserRepository } from '@/modules/users/domain/repositories/user.repository.interface';
import { UserOutputDTO } from '../dtos/user-output.dto';

export class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<UserOutputDTO[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => UserOutputDTO.fromEntity(user));
  }
}
