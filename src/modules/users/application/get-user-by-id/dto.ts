import { Expose, plainToInstance } from 'class-transformer';
import { User } from '../../domain/entities/user.entity';

export class GetUserByIdOutputDTO {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() email!: string;
  @Expose() createdAt!: Date;
  @Expose() updatedAt!: Date;

  static fromEntity(user: User): GetUserByIdOutputDTO {
    return plainToInstance(GetUserByIdOutputDTO, user, {
      excludeExtraneousValues: true,
    });
  }
}
