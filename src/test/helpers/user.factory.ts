import { faker } from '@faker-js/faker';
import { User } from '@/modules/users/domain/entities/user.entity';
import { InMemoryUserRepository } from '@/modules/users/domain/repositories/fakes/in-memory-user.repository';

interface UserData {
  name: string;
  email: string;
}

export function buildUserData(overrides?: Partial<UserData>): UserData {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    ...overrides,
  };
}

export async function createUser(userRepository: InMemoryUserRepository, overrides?: Partial<UserData>): Promise<User> {
  return userRepository.create(User.create(buildUserData(overrides)));
}
