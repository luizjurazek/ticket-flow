import { IUserRepository } from '@/modules/users/domain/repositories/user.repository.interface';
import { IUserLookup } from '@/modules/tickets/domain/services/user-lookup.interface';

export class UserLookupAdapter implements IUserLookup {
  constructor(private readonly userRepository: IUserRepository) {}

  async findById(id: string): Promise<{ id: string } | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    return { id: user.id };
  }
}
