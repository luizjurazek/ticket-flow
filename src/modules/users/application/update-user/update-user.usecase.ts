import { IUpdateUserData } from '@/modules/users/domain/entities/user.entity';
import { IUserRepository } from '@/modules/users/domain/repositories/user.repository.interface';
import { UpdateUserOutputDTO } from './dto';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, data: IUpdateUserData): Promise<UpdateUserOutputDTO> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error('User not found');

    user.update(data);
    await this.userRepository.update(user);

    return UpdateUserOutputDTO.fromEntity(user);
  }
}
