import { prisma } from '@/shared/database/prisma';
import { TicketsController } from '../tickets.controller';
import { PrismaTicketsRepository } from '../../prisma/prisma-tickets.repository';
import { CreateTicketUseCase } from '@/modules/tickets/application/create-ticket/create-ticket.usecase';
import { makeTicketClassifier } from '@/modules/ticket-classifier/infrastructure/factories/ticket-classifier.factory';
import { ControllerRegistry } from '@/shared/infra/swagger/registry/controller.registry';
import { GetTicketByIdUseCase } from '@/modules/tickets/application/get-ticket-by-id/get-ticket-by-id.usecase';
import { GetTicketsUseCase } from '@/modules/tickets/application/get-tickets/get-tickets.usecase';
import { GetTicketsByUserUseCase } from '@/modules/tickets/application/get-tickets-by-user/get-tickets-by-user.usecase';
import { UpdateTicketStatusUseCase } from '@/modules/tickets/application/update-ticket-status/update-ticket-status.usecase';
import { PrismaUserRepository } from '@/modules/users/infrastructure/prisma/prisma-users.repository';

export function makeTicketsController(): TicketsController {
  const ticketRepository = new PrismaTicketsRepository(prisma);
  const ticketClassifier = makeTicketClassifier();
  const userLookup = new PrismaUserRepository(prisma);

  const controller = new TicketsController(
    new CreateTicketUseCase(ticketRepository, ticketClassifier, userLookup),
    new GetTicketsUseCase(ticketRepository),
    new GetTicketByIdUseCase(ticketRepository),
    new GetTicketsByUserUseCase(ticketRepository),
    new UpdateTicketStatusUseCase(ticketRepository),
  );

  ControllerRegistry.register(controller);

  return controller;
}
