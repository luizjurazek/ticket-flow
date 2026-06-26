import { CreateUserUseCase } from './create-user.usecase';
import { InMemoryUserRepository } from '@/modules/users/domain/repositories/fakes/in-memory-user.repository';
import { AppError } from '@/shared/errors/app-error';
import { faker } from '@faker-js/faker';
import { User } from '../../domain/entities/user.entity';

describe('CreateUserUseCase', () => {
  let userRepository: InMemoryUserRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it('should create a new user successfully', async () => {
    const user = await createUserUseCase.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });

    expect(user).not.toBeNull();
    expect(user.id).toBeDefined();
    expect(user.email).toBe(user.email);
    expect(user.name).toBe(user.name);
  });

  it('should throw error when user already exists', async () => {
    const user = await createUserUseCase.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });

    await expect(createUserUseCase.execute(user)).rejects.toBeInstanceOf(AppError);
  });

  it('should throw error when email is empty', async () => {
    await expect(createUserUseCase.execute({ name: faker.person.fullName(), email: '' })).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should throw error when name is empty', async () => {
    await expect(createUserUseCase.execute({ name: '', email: faker.internet.email() })).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should throw error when email is invalid', async () => {
    await expect(
      createUserUseCase.execute({ name: faker.person.fullName(), email: 'invalid-email' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
