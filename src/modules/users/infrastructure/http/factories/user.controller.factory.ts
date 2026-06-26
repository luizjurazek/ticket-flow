import { prisma } from '@/shared/database/prisma';
import { PrismaUserRepository } from '@/modules/users/infrastructure/prisma/prisma-user.repository';
import { UserController } from '@/modules/users/infrastructure/http/user.controller';
import { CreateUserUseCase } from '@/modules/users/application/create-user/create-user-usecase';
import { UpdateUserUseCase } from '@/modules/users/application/update-user/update-user.usecase';
import { GetUsersUseCase } from '@/modules/users/application/get-users/get-user.usecase';
import { GetUserByIdUseCase } from '@/modules/users/application/get-user-by-id/get-user-by-id.usecase';
import { DeleteUserUseCase } from '@/modules/users/application/detete-user/delete-user.usecase';

export function makeUserController(): UserController {
  const userRepository = new PrismaUserRepository(prisma);
  const createUserUseCase = new CreateUserUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const getUsersUseCase = new GetUsersUseCase(userRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);

  return new UserController(
    createUserUseCase,
    updateUserUseCase,
    getUsersUseCase,
    getUserByIdUseCase,
    deleteUserUseCase,
  );
}
