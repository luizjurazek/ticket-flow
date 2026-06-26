import { AppError } from '@/shared/errors/AppError';
import { Ticket } from '@/modules/tickets/domain/ticket.entity';
import { v4 as uuidv4 } from 'uuid';

export interface ICreateUserData {
  name: string;
  email: string;
}

export interface IUpdateUserData {
  name?: string;
  email?: string;
}

export class User {
  public name: string;
  public email: string;
  public id: string;
  public tickets: Ticket[];
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: Partial<User> & { name: string; email: string }) {
    this.name = props.name;
    this.email = props.email;
    this.id = props.id ?? uuidv4();
    this.tickets = props.tickets ?? [];
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
  static create(userData: ICreateUserData): User {
    if (!userData.name || !userData.email) {
      throw new AppError('Name and email are required', 400);
    }
    if (!userData.email.includes('@')) {
      throw new AppError('Invalid email', 400);
    }
    return new User(userData);
  }

  update(userData: IUpdateUserData): void {
    if (!userData.name && !userData.email) {
      throw new AppError('Name or email is required', 400);
    }
    if (userData.email && !userData.email.includes('@')) {
      throw new AppError('Invalid email', 400);
    }

    if (userData.name) this.name = userData.name;
    if (userData.email) this.email = userData.email;
    this.updatedAt = new Date();
  }
}
