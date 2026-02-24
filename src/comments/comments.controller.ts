import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiTags('Ticket Comments')
  @Post('tickets/:ticketId/comments')
  @ApiOperation({ summary: 'Add a comment to a ticket' })
  create(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any,
  ) {
    return this.commentsService.create(ticketId, createCommentDto, req.user);
  }

  @ApiTags('Ticket Comments')
  @Get('tickets/:ticketId/comments')
  @ApiOperation({ summary: 'Get comments of a ticket' })
  findAll(@Param('ticketId', ParseIntPipe) ticketId: number, @Req() req: any) {
    return this.commentsService.findAllByTicket(ticketId, req.user);
  }

  @ApiTags('Comments Management')
  @Patch('comments/:id')
  @ApiOperation({ summary: 'Update your own comment or any if MANAGER' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: any,
  ) {
    return this.commentsService.update(id, updateCommentDto, req.user);
  }

  @ApiTags('Comments Management')
  @Delete('comments/:id')
  @ApiOperation({ summary: 'Delete your own comment or any if MANAGER' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.commentsService.remove(id, req.user);
  }
}
