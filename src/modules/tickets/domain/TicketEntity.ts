export class Ticket {
  constructor(
    public id: string,
    public message: string,
    public channel: string,
    public priority: string,
    public status: string,
    public userId: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date,
  ) {}
}
