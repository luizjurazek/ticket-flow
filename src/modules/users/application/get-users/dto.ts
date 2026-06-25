import { Expose, plainToInstance } from 'class-transformer';
import { User } from '../../domain/entities/UserEntity';

export class GetUsersOutputDTO {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() email!: string;
  @Expose() createdAt!: Date;
  @Expose() updatedAt!: Date;

  static fromEntity(user: User): GetUsersOutputDTO {
    return plainToInstance(GetUsersOutputDTO, user, {
      excludeExtraneousValues: true,
    });
  }
}
