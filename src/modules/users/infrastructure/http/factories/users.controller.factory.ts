import { prisma } from '@/shared/database/prisma';
import { PrismaUserRepository } from '@/modules/users/infrastructure/prisma/prisma-users.repository';
import { UsersController } from '@/modules/users/infrastructure/http/users.controller';
import { CreateUserUseCase } from '@/modules/users/application/create-user/create-user.usecase';
import { UpdateUserUseCase } from '@/modules/users/application/update-user/update-user.usecase';
import { GetUsersUseCase } from '@/modules/users/application/get-users/get-users.usecase';
import { GetUserByIdUseCase } from '@/modules/users/application/get-user-by-id/get-user-by-id.usecase';
import { DeleteUserUseCase } from '@/modules/users/application/delete-user/delete-user.usecase';
import { UserTicketCheckerAdapter } from '@/modules/users/infrastructure/adapters/user-ticket-checker.adapter';
import { ControllerRegistry } from '@/shared/infra/swagger/registry/controller.registry';
import { PrismaTicketsRepository } from '@/modules/tickets/infrastructure/prisma/prisma-tickets.repository';

export function makeUsersController(): UsersController {
  const userRepository = new PrismaUserRepository(prisma);

  const ticketRepository = new PrismaTicketsRepository(prisma);
  const userTicketChecker = new UserTicketCheckerAdapter(ticketRepository);

  const controller = new UsersController(
    new CreateUserUseCase(userRepository),
    new UpdateUserUseCase(userRepository),
    new GetUsersUseCase(userRepository),
    new GetUserByIdUseCase(userRepository),
    new DeleteUserUseCase(userRepository, userTicketChecker),
  );

  ControllerRegistry.register(controller);

  return controller;
}
