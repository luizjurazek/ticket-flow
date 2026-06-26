import { faker } from '@faker-js/faker';
import { User } from '@/modules/users/domain/entities/user.entity';
import { InMemoryUserRepository } from '@/modules/users/domain/repositories/fakes/in-memory-user.repository';
import { AppError } from '@/shared/errors/app-error';
import { UpdateUserUseCase } from './update-user.usecase';

describe('UpdateUserUseCase', () => {
  let userRepository: InMemoryUserRepository;
  let updateUserUseCase: UpdateUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    updateUserUseCase = new UpdateUserUseCase(userRepository);
  });

  async function createUser(userRepository: InMemoryUserRepository): Promise<User> {
    return userRepository.create(User.create({ name: faker.person.fullName(), email: faker.internet.email() }));
  }

  it('should update user name successfully', async () => {
    const user = await createUser(userRepository);
    const updatedName = faker.person.fullName();

    const updatedUser = await updateUserUseCase.execute(user.id, { name: updatedName });

    expect(updatedUser.name).toBe(updatedName);
    expect(updatedUser.email).toBe(user.email);

    const persistedUser = await userRepository.findById(user.id);
    expect(persistedUser?.name).toBe(updatedName);
  });

  it('should update user email successfully', async () => {
    const user = await createUser(userRepository);
    const updatedEmail = faker.internet.email();

    const updatedUser = await updateUserUseCase.execute(user.id, { email: updatedEmail });

    expect(updatedUser.email).toBe(updatedEmail);
    expect(updatedUser.name).toBe(user.name);

    const persistedUser = await userRepository.findById(user.id);
    expect(persistedUser?.email).toBe(updatedEmail);
  });

  it('should update user name and email successfully', async () => {
    const user = await createUser(userRepository);
    const updatedData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    };

    const updatedUser = await updateUserUseCase.execute(user.id, updatedData);

    expect(updatedUser).toMatchObject({
      id: user.id,
      name: updatedData.name,
      email: updatedData.email,
    });

    const persistedUser = await userRepository.findById(user.id);
    expect(persistedUser).toMatchObject(updatedData);
  });

  it('should throw error when user is not found', async () => {
    await expect(updateUserUseCase.execute('non-existent-id', { name: faker.person.fullName() })).rejects.toThrow(
      'User not found',
    );
  });

  it('should throw error when name and email are empty', async () => {
    const user = await createUser(userRepository);

    await expect(updateUserUseCase.execute(user.id, {})).rejects.toBeInstanceOf(AppError);
  });

  it('should throw error when email is invalid', async () => {
    const user = await createUser(userRepository);

    await expect(updateUserUseCase.execute(user.id, { email: 'invalid-email' })).rejects.toBeInstanceOf(AppError);
  });
});
