import { CreateUserUseCase } from './create-user-usecase';
import { InMemoryUserRepository } from '@/modules/users/domain/repositories/fakes/InMemoryUserRepository';
import { AppError } from '@/shared/errors/AppError';

describe('CreateUserUseCase', () => {
  let userRepository: InMemoryUserRepository;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    useCase = new CreateUserUseCase(userRepository);
  });

  it('should create a new user successfully', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@email.com',
    };

    const user = await useCase.execute(userData);

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.email).toBe(userData.email);
    expect(user.name).toBe(userData.name);
  });

  it('should throw error when user already exists', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@email.com',
    };

    await useCase.execute(userData);
    await expect(useCase.execute(userData)).rejects.toBeInstanceOf(AppError);
  });

  it('should throw error when email is empty', async () => {
    const userData = {
      name: 'John Doe',
      email: '',
    };

    await expect(useCase.execute(userData)).rejects.toBeInstanceOf(AppError);
  });

  it('should throw error when name is empty', async () => {
    const userData = {
      name: '',
      email: 'john@email.com',
    };

    await expect(useCase.execute(userData)).rejects.toBeInstanceOf(AppError);
  });

  it('should throw error when email is invalid', async () => {
    const userData = {
      name: 'John Doe',
      email: 'invalid-email',
    };

    await expect(useCase.execute(userData)).rejects.toBeInstanceOf(AppError);
  });
});
