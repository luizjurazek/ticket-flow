import { CreateUserUseCase } from './create-user.usecase';
import { InMemoryUserRepository } from '@/modules/users/domain/repositories/fakes/in-memory-user.repository';
import { AppError } from '@/shared/errors/app-error';
import { faker } from '@faker-js/faker';

describe('CreateUserUseCase', () => {
  let userRepository: InMemoryUserRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it('should create a new user successfully', async () => {
    const userData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    };

    const user = await createUserUseCase.execute(userData);

    expect(user.id).toBeDefined();
    expect(user.email).toBe(userData.email);
    expect(user.name).toBe(userData.name);
  });

  it('should throw error when user already exists', async () => {
    const userData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    };

    await createUserUseCase.execute(userData);
    await expect(createUserUseCase.execute(userData)).rejects.toMatchObject({
      message: 'User already exists',
      statusCode: 400,
    });
  });
});
