import { v4 as uuidv4 } from 'uuid';
import { TicketChannel, TicketPriority, TicketStatus } from '@/shared/domain/ticket/ticket.enums';

export interface ICreateTicketInput {
  message: string;
  userId: string;
}

export interface ICreateTicketData {
  message: string;
  channel: TicketChannel;
  priority: TicketPriority;
  userId: string;
  manuallyReview: boolean;
}

export class Ticket {
  public id: string;
  public message: string;
  public channel: TicketChannel;
  public priority: TicketPriority;
  public status: TicketStatus;
  public userId: string;
  public manuallyReview: boolean;
  public reviewedBy: string | null;
  public reviewedAt: Date | null;

  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: Partial<Ticket> & ICreateTicketData) {
    this.id = props.id ?? uuidv4();
    this.message = props.message;
    this.channel = props.channel;
    this.priority = props.priority;
    this.status = props.status ?? TicketStatus.OPEN;
    this.userId = props.userId;
    this.manuallyReview = props.manuallyReview ?? false;
    this.reviewedBy = props.reviewedBy ?? null;
    this.reviewedAt = props.reviewedAt ?? null;

    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  static create(data: ICreateTicketData): Ticket {
    return new Ticket(data);
  }
}
