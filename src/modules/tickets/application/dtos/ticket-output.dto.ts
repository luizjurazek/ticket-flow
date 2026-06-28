import { Expose, plainToInstance } from 'class-transformer';
import { Ticket } from '@/modules/tickets/domain/entities/ticket.entity';
import { ApiProperty } from '@swagger/decorators';

export class TicketOutputDTO {
  @ApiProperty() @Expose() id!: string;
  @ApiProperty() @Expose() userId!: string;
  @ApiProperty() @Expose() message!: string;
  @ApiProperty() @Expose() channel!: string;
  @ApiProperty() @Expose() priority!: string;
  @ApiProperty() @Expose() status!: string;
  @ApiProperty() @Expose() manuallyReview!: boolean;
  @ApiProperty() @Expose() reviedBy!: string;
  @ApiProperty() @Expose() reviewedAt!: Date;

  @ApiProperty() @Expose() createdAt!: Date;
  @ApiProperty() @Expose() updatedAt!: Date;

  static fromEntity(ticket: Ticket): TicketOutputDTO {
    return plainToInstance(TicketOutputDTO, ticket, {
      excludeExtraneousValues: true,
    });
  }
}
