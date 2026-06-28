import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@swagger/decorators';

export class CreateTicketInputDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'User ID is required' })
  @MinLength(36, { message: 'User ID must be a valid UUID' })
  userId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Message is required' })
  message!: string;
}
