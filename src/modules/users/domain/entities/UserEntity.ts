import { Ticket } from "../../../tickets/domain/Ticket.entity";

export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public tickets: Ticket[] = [],
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}