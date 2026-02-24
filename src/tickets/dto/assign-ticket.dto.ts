import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTicketDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
