import { prisma } from "../../../../../shared/database/prisma";
import { PrismaUserRepository } from "../../prisma/PrismaUserRepository";
import { UserController } from "../UserController";
import { CreateUserUseCase } from "../../../application/create-user/CreateUserUseCase";
import { UpdateUserUseCase } from "../../../application/update-user/UpdateUserUseCase";
import { GetUsersUseCase } from "../../../application/get-users/GetUsersUseCase";


export function makeUserController(): UserController {
  const userRepository = new PrismaUserRepository(prisma);
  const createUserUseCase = new CreateUserUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const getUsersUseCase = new GetUsersUseCase(userRepository);
  
  return new UserController(createUserUseCase, updateUserUseCase, getUsersUseCase);
}
