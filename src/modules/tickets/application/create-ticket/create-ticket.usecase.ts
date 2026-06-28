import { ITicketRepository } from '@/modules/tickets/domain/repositories/ticket.repository.interface';
import { Ticket } from '@/modules/tickets/domain/entities/ticket.entity';
import { ICreateTicketInput } from '@/modules/tickets/domain/entities/ticket.entity';
import { IClassifyTicketService } from '@/modules/tickets/domain/services/classify-ticket.service.interface';
import { TicketOutputDTO } from '@/modules/tickets/application/dtos/ticket-output.dto';

export class CreateTicketUseCase {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly ticketClassifier: IClassifyTicketService,
  ) {}

  async execute(data: ICreateTicketInput): Promise<TicketOutputDTO> {
    // TODO: add a queue system to avoid crashing the system
    // and overloading the AI model
    const classification = await this.ticketClassifier.classify(data.message);
    const ticket = Ticket.create({
      message: data.message,
      userId: data.userId,
      manuallyReview: classification.manuallyReview,
      channel: classification.channel,
      priority: classification.priority,
    });

    const createdTicket = await this.ticketRepository.create(ticket);
    return TicketOutputDTO.fromEntity(createdTicket);
  }
}
