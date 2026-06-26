import { DeleteUserUseCase } from './delete-user.usecase';
import { CreateUserUseCase } from '../create-user/create-user-usecase';
import { InMemoryUserRepository } from '@/modules/users/domain/repositories/fakes/in-memory-user.repository';
import { AppError } from '@/shared/errors/app-error';

describe('DeleteUserUseCase', () => {
  let userRepository: InMemoryUserRepository;
  let deleteUserUseCase: DeleteUserUseCase;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    deleteUserUseCase = new DeleteUserUseCase(userRepository);
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it('should delete a user successfully', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@email.com',
    };

    const user = await createUserUseCase.execute(userData);

    await deleteUserUseCase.execute(user.id);

    const deletedUser = await userRepository.findById(user.id);
    expect(deletedUser).toBeNull();
  });

  it('should throw error when user is not found', async () => {
    await expect(deleteUserUseCase.execute('non-existent-id')).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should not delete other users when deleting one user', async () => {
    const firstUser = await createUserUseCase.execute({
      name: 'John Doe',
      email: 'john@email.com',
    });

    const secondUser = await createUserUseCase.execute({
      name: 'Jane Doe',
      email: 'jane@email.com',
    });

    await deleteUserUseCase.execute(firstUser.id);

    const remainingUser = await userRepository.findById(secondUser.id);
    expect(remainingUser).toBeDefined();
    expect(remainingUser?.email).toBe(secondUser.email);
  });
});
