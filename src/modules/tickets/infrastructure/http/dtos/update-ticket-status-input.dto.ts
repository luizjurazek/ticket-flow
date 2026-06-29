import { TicketStatus } from '@/shared/domain/ticket/ticket.enums';
import { IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@swagger/decorators';

export class UpdateTicketStatusInputDTO {
  @ApiProperty()
  @IsIn(Object.values(TicketStatus), { message: 'Invalid status' })
  @IsNotEmpty({ message: 'Status is required' })
  status!: TicketStatus;
}
