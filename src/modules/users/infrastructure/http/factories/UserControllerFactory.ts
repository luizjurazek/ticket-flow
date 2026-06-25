import { prisma } from "../../../../../shared/database/prisma";
import { CreateUserUseCase } from "../../../application/create-user/CreateUserUseCase";
import { UpdateUserUseCase } from "../../../application/update-user/UpdateUserUseCase";
import { PrismaUserRepository } from "../../prisma/PrismaUserRepository";
import { UserController } from "../UserController";

export function makeUserController(): UserController {
  const userRepository = new PrismaUserRepository(prisma);
  const createUserUseCase = new CreateUserUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  
  return new UserController(createUserUseCase, updateUserUseCase);
}
