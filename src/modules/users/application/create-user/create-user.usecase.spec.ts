import { CreateUserUseCase } from './create-user.usecase';
import { InMemoryUserRepository } from '@/modules/users/domain/repositories/fakes/in-memory-user.repository';
import { HttpStatus } from '@/shared/utils/http-status';
import { buildUserData } from '@/test/helpers/user.factory';

describe('CreateUserUseCase', () => {
  let userRepository: InMemoryUserRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it('should create a new user successfully', async () => {
    const userData = buildUserData();

    const user = await createUserUseCase.execute(userData);

    expect(user.id).toBeDefined();
    expect(user.email).toBe(userData.email);
    expect(user.name).toBe(userData.name);
  });

  it('should throw error when user already exists', async () => {
    const userData = buildUserData();

    await createUserUseCase.execute(userData);
    await expect(createUserUseCase.execute(userData)).rejects.toMatchObject({
      message: 'User already exists',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  });
});
