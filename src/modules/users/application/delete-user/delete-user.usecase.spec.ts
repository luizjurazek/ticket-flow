import { DeleteUserUseCase } from './delete-user.usecase';
import { InMemoryUserRepository } from '@/modules/users/domain/repositories/fakes/in-memory-user.repository';
import { UserTicketCheckerAdapter } from '@/modules/users/infrastructure/adapters/user-ticket-checker.adapter';
import { InMemoryTicketRepository } from '@/modules/tickets/domain/repositories/fakes/in-memory-ticket.repository';
import { HttpStatus } from '@/shared/utils/http-status';
import { createUser } from '@/test/helpers/user.factory';
import { createTicket } from '@/test/helpers/ticket.factory';

describe('DeleteUserUseCase', () => {
  let userRepository: InMemoryUserRepository;
  let ticketRepository: InMemoryTicketRepository;
  let deleteUserUseCase: DeleteUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    ticketRepository = new InMemoryTicketRepository();
    const userTicketChecker = new UserTicketCheckerAdapter(ticketRepository);
    deleteUserUseCase = new DeleteUserUseCase(userRepository, userTicketChecker);
  });

  it('should delete a user successfully', async () => {
    const user = await createUser(userRepository);
    await deleteUserUseCase.execute(user.id);

    const deletedUser = await userRepository.findById(user.id);
    expect(deletedUser).toBeNull();
  });

  it('should throw error when user is not found', async () => {
    await expect(deleteUserUseCase.execute('non-existent-id')).rejects.toMatchObject({
      message: 'User not found',
      statusCode: HttpStatus.NOT_FOUND,
    });
  });

  it('should throw error when user has associated tickets', async () => {
    const user = await createUser(userRepository);
    await createTicket(ticketRepository, { userId: user.id });

    await expect(deleteUserUseCase.execute(user.id)).rejects.toMatchObject({
      message: 'User has associated tickets and cannot be deleted',
      statusCode: HttpStatus.CONFLICT,
    });

    const existingUser = await userRepository.findById(user.id);
    expect(existingUser).not.toBeNull();
  });

  it('should not delete other users when deleting one user', async () => {
    const firstUser = await createUser(userRepository);
    const secondUser = await createUser(userRepository);

    await deleteUserUseCase.execute(firstUser.id);
    const remainingUser = await userRepository.findById(secondUser.id);

    expect(remainingUser).not.toBeNull();
    expect(remainingUser?.name).toBe(secondUser.name);
    expect(remainingUser?.email).toBe(secondUser.email);
  });
});
