import { IUserRepository } from '../user.repository.interface';
import { User } from '../../entities/user.entity';

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async update(user: User): Promise<User> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
    return user;
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }
}
