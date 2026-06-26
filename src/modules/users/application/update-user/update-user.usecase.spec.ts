import { faker } from '@faker-js/faker';
import { InMemoryUserRepository } from '@/modules/users/domain/repositories/fakes/in-memory-user.repository';
import { HttpStatus } from '@/shared/http/http-status';
import { createUser } from '@/test/helpers/user.factory';
import { UpdateUserUseCase } from './update-user.usecase';

describe('UpdateUserUseCase', () => {
  let userRepository: InMemoryUserRepository;
  let updateUserUseCase: UpdateUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    updateUserUseCase = new UpdateUserUseCase(userRepository);
  });

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
    await expect(updateUserUseCase.execute('non-existent-id', { name: faker.person.fullName() })).rejects.toMatchObject(
      {
        message: 'User not found',
        statusCode: HttpStatus.NOT_FOUND,
      },
    );
  });

  it('should throw error when email is already in use', async () => {
    const firstUser = await createUser(userRepository);
    const secondUser = await createUser(userRepository);

    await expect(updateUserUseCase.execute(firstUser.id, { email: secondUser.email })).rejects.toMatchObject({
      message: 'Email already exists',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  });

  it('should throw error when name and email are empty', async () => {
    const user = await createUser(userRepository);

    await expect(updateUserUseCase.execute(user.id, {})).rejects.toMatchObject({
      message: 'At least one field is required to update',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  });
});
