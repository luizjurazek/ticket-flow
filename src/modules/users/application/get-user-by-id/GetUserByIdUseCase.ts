import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { GetUserByIdOutputDTO } from "./dto";

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<GetUserByIdOutputDTO> {
    const user = await this.userRepository.findById(id);
    if(!user) throw new Error("User not found");
    return GetUserByIdOutputDTO.fromEntity(user);
  }
} 