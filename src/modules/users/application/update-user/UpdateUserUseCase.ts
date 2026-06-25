import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUpdateUserData } from "../../domain/entities/UserEntity";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, data: IUpdateUserData) {
    const user = await this.userRepository.findById(id);
    if(!user) throw new Error("User not found");
    
    user.update(data);
    await this.userRepository.update(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
} 