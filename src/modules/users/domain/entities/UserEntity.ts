import { Ticket } from "../../../tickets/domain/TicketEntity";
import { v4 as uuidv4 } from "uuid";  

export interface ICreateUserData {
  name: string;
  email: string;
}

export class User {
  constructor(
    public name: string,
    public email: string,
    public id: string = uuidv4(),
    public tickets: Ticket[] = [],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  static create(userData: ICreateUserData): User {
    return new User(userData.name, userData.email)
  }

  update(userData: ICreateUserData): void {
    this.name = userData.name;
    this.email = userData.email;
    this.updatedAt = new Date();
  }
}