import { User } from "../../domain/entities/UserEntity";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { GetUsersOutputDTO } from "./dto";

export class GetUsersUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<GetUsersOutputDTO[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => GetUsersOutputDTO.fromEntity(user)); 
  }
}