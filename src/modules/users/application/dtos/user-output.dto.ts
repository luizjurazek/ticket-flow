import { Expose, plainToInstance } from 'class-transformer';
import { User } from '@/modules/users/domain/entities/user.entity';
import { ApiProperty } from '@swagger/decorators';

export class UserOutputDTO {
  @ApiProperty() @Expose() id!: string;
  @ApiProperty() @Expose() name!: string;
  @ApiProperty() @Expose() email!: string;
  @ApiProperty() @Expose() createdAt!: Date;
  @ApiProperty() @Expose() updatedAt!: Date;
  static fromEntity(user: User): UserOutputDTO {
    return plainToInstance(UserOutputDTO, user, {
      excludeExtraneousValues: true,
    });
  }
}
