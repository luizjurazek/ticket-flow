import { GetUserByIdUseCase } from './get-user-by-id.usecase';
import { InMemoryUserRepository } from '@/modules/users/domain/repositories/fakes/in-memory-user.repository';
import { HttpStatus } from '@/shared/utils/http-status';
import { createUser } from '@/test/helpers/user.factory';

describe('GetUserByIdUseCase', () => {
  let userRepository: InMemoryUserRepository;
  let getUserByIdUseCase: GetUserByIdUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  });

  it('should get a user by id successfully', async () => {
    const user = await createUser(userRepository);

    const userById = await getUserByIdUseCase.execute(user.id);

    expect(userById.id).toBe(user.id);
    expect(userById.name).toBe(user.name);
    expect(userById.email).toBe(user.email);
  });

  it('should throw error when user is not found', async () => {
    await expect(getUserByIdUseCase.execute('non-existent-id')).rejects.toMatchObject({
      message: 'User not found',
      statusCode: HttpStatus.NOT_FOUND,
    });
  });
});
