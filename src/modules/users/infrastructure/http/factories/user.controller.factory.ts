import { prisma } from '../../../../../shared/database/prisma';
import { PrismaUserRepository } from '../../prisma/prisma-user.repository';
import { UserController } from '../user.controller';
import { CreateUserUseCase } from '../../../application/create-user/create-user-usecase';
import { UpdateUserUseCase } from '../../../application/update-user/update-user.usecase';
import { GetUsersUseCase } from '../../../application/get-users/get-user.usecase';
import { GetUserByIdUseCase } from '../../../application/get-user-by-id/get-user-by-id.usecase';
import { DeleteUserUseCase } from '../../../application/detete-user/delete-user.usecase';

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
