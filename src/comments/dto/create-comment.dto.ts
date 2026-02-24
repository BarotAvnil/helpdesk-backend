import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'We are checking the issue' })
  @IsString()
  @IsNotEmpty()
  comment: string;
}
