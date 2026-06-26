import { Expose, plainToInstance } from 'class-transformer';
import { User } from '@/modules/users/domain/entities/user.entity';
export class UserOutputDTO {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() email!: string;
  @Expose() createdAt!: Date;
  @Expose() updatedAt!: Date;
  static fromEntity(user: User): UserOutputDTO {
    return plainToInstance(UserOutputDTO, user, {
      excludeExtraneousValues: true,
    });
  }
}
