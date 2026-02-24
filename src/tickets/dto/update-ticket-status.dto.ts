import { IsEnum, IsNotEmpty } from 'class-validator';
import { TicketStatus } from '../enums/ticket.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTicketStatusDto {
  @ApiProperty({ enum: TicketStatus, example: TicketStatus.IN_PROGRESS })
  @IsNotEmpty()
  @IsEnum(TicketStatus)
  status: TicketStatus;
}
