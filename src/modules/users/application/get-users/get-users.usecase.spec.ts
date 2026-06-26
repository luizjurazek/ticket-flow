import { faker } from '@faker-js/faker';
import { User } from '@/modules/users/domain/entities/user.entity';
import { InMemoryUserRepository } from '@/modules/users/domain/repositories/fakes/in-memory-user.repository';
import { GetUsersUseCase } from './get-users.usecase';

describe('GetUsersUseCase', () => {
  let getUsersUseCase: GetUsersUseCase;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    getUsersUseCase = new GetUsersUseCase(userRepository);
  });

  async function createUser(userRepository: InMemoryUserRepository): Promise<User> {
    return userRepository.create(
      User.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
      }),
    );
  }

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
