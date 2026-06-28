import { prisma } from '@/shared/database/prisma';
import { TicketsController } from '../tickets.controller';
import { PrismaTicketsRepository } from '../../prisma/prisma-tickets.repository';
import { CreateTicketUseCase } from '@/modules/tickets/application/create-ticket/create-ticket.usecase';
import { makeTicketClassifier } from '@/modules/ticket-classifier/infrastructure/factories/ticket-classifier.factory';
import { ControllerRegistry } from '@/shared/infra/swagger/registry/controller.registry';

export function makeTicketsController(): TicketsController {
  const ticketRepository = new PrismaTicketsRepository(prisma);
  const ticketClassifier = makeTicketClassifier();

  const controller = new TicketsController(new CreateTicketUseCase(ticketRepository, ticketClassifier));

  ControllerRegistry.register(controller);

  return controller;
}
