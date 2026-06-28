import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@swagger/decorators';

export class UpdateUserInputDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name?: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email address' })
  @IsOptional()
  email?: string;
}
