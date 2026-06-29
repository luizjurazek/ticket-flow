import { IsNotEmpty, IsString, MinLength, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@swagger/decorators';

export class CreateTicketInputDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'User ID is required' })
  @IsUUID(4, { message: 'User ID must be a valid UUID' })
  userId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Message is required' })
  @MaxLength(2000, { message: 'Message must be less than 1000 characters' })
  message!: string;
}
