import { IsNotEmpty, IsUUID } from 'class-validator';
export class IdParamDTO {
  @IsUUID('4', { message: 'Invalid id format' })
  @IsNotEmpty({ message: 'Id is required' })
  id!: string;
}
