import { AppError } from '@/shared/errors/app-error';
import { HttpStatus } from '@/shared/utils/http-status';
import { IUserRepository } from '@/modules/users/domain/repositories/user.repository.interface';
import { IUserTicketChecker } from '@/modules/users/domain/services/user-ticket-checker.interface';

export class DeleteUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userTicketChecker: IUserTicketChecker,
  ) {}

  // If the bussines need the user for something later,
  // we can use the soft delete strategy and add a column to
  // the user table to indicate if the user is deleted or not
  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('User not found', HttpStatus.NOT_FOUND);

    const hasTickets = await this.userTicketChecker.hasTicketsByUserId(id);
    if (hasTickets) {
      throw new AppError('User has associated tickets and cannot be deleted', HttpStatus.CONFLICT);
    }

    await this.userRepository.delete(id);
  }
}
