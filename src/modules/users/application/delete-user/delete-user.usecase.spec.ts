import { DeleteUserUseCase } from './delete-user.usecase';
import { CreateUserUseCase } from '../create-user/create-user.usecase';
import { InMemoryUserRepository } from '@/modules/users/domain/repositories/fakes/in-memory-user.repository';
import { AppError } from '@/shared/errors/app-error';
import { User } from '@/modules/users/domain/entities/user.entity';
import { faker } from '@faker-js/faker';

describe('DeleteUserUseCase', () => {
  let userRepository: InMemoryUserRepository;
  let deleteUserUseCase: DeleteUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    deleteUserUseCase = new DeleteUserUseCase(userRepository);
  });

  async function createUser(userRepository: InMemoryUserRepository): Promise<User> {
    return userRepository.create(User.create({ name: faker.person.fullName(), email: faker.internet.email() }));
  }

  it('should delete a user successfully', async () => {
    const user = await createUser(userRepository);
    await deleteUserUseCase.execute(user.id);

    const deletedUser = await userRepository.findById(user.id);
    expect(deletedUser).toBeNull();
  });

  it('should throw error when user is not found', async () => {
    await expect(deleteUserUseCase.execute('non-existent-id')).rejects.toBeInstanceOf(AppError);
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
