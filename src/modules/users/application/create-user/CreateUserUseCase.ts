import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ICreateUserData, User } from "../../domain/entities/UserEntity";

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userData: ICreateUserData): Promise<User> {
    const userExists = await this.userRepository.findByEmail(userData.email);
    if (userExists) {
      throw new Error("User already exists");
    }
    
    const newUser = User.create(userData);

    await this.userRepository.create(newUser);
    return newUser;
  }
}