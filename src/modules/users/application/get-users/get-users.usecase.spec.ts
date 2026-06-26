import { InMemoryUserRepository } from '@/modules/users/domain/repositories/fakes/in-memory-user.repository';
import { createUser } from '@/test/helpers/user.factory';
import { GetUsersUseCase } from './get-users.usecase';

describe('GetUsersUseCase', () => {
  let getUsersUseCase: GetUsersUseCase;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    getUsersUseCase = new GetUsersUseCase(userRepository);
  });

  it('should get all users successfully', async () => {
    const firstUser = await createUser(userRepository);
    const secondUser = await createUser(userRepository);

    const users = await getUsersUseCase.execute();

    expect(users).toHaveLength(2);
    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: firstUser.id,
          name: firstUser.name,
          email: firstUser.email,
        }),
        expect.objectContaining({
          id: secondUser.id,
          name: secondUser.name,
          email: secondUser.email,
        }),
      ]),
    );
  });

  it('should return an empty array when there are no users', async () => {
    const users = await getUsersUseCase.execute();

    expect(users).toEqual([]);
  });
});
