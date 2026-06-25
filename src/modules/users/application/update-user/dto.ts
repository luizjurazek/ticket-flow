import { Expose, plainToInstance } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { User } from '../../domain/entities/UserEntity';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name?: string;

  @IsEmail({}, { message: 'Invalid email address' })
  @IsOptional()
  email?: string;
}

export class UpdateUserOutputDTO {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() email!: string;
  @Expose() createdAt!: Date;
  @Expose() updatedAt!: Date;

  static fromEntity(user: User): UpdateUserOutputDTO {
    return plainToInstance(UpdateUserOutputDTO, user, { 
      excludeExtraneousValues: true 
    });
  }
}

