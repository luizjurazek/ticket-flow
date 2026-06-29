export interface IUserTicketChecker {
  hasTicketsByUserId(userId: string): Promise<boolean>;
}
