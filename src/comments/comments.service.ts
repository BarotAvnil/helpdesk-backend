import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketComment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { TicketsService } from '../tickets/tickets.service';
import { UsersService } from '../users/users.service';
import { RoleEnum } from '../roles/enums/role.enum';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(TicketComment)
    private commentRepository: Repository<TicketComment>,
    private ticketsService: TicketsService,
    private usersService: UsersService,
  ) {}

  private async canAccessTicket(ticketId: number, user: any) {
    if (user.role === RoleEnum.MANAGER) return true;

    const ticket = await this.ticketsService.findOne(ticketId);

    if (user.role === RoleEnum.SUPPORT && ticket.assignedTo?.id === user.id)
      return true;
    if (user.role === RoleEnum.USER && ticket.createdBy.id === user.id)
      return true;

    throw new ForbiddenException(
      'You do not have permission to access comments on this ticket',
    );
  }

  async create(
    ticketId: number,
    createCommentDto: CreateCommentDto,
    user: any,
  ) {
    await this.canAccessTicket(ticketId, user);

    const ticket = await this.ticketsService.findOne(ticketId);
    const author = await this.usersService.findById(user.id);

    const comment = this.commentRepository.create({
      ...createCommentDto,
      ticket,
      user: author,
    });

    return this.commentRepository.save(comment);
  }

  async findAllByTicket(ticketId: number, user: any) {
    await this.canAccessTicket(ticketId, user);

    return this.commentRepository.find({
      where: { ticket: { id: ticketId } },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!comment) throw new NotFoundException(`Comment #${id} not found`);
    return comment;
  }

  private async canModifyComment(commentId: number, user: any) {
    if (user.role === RoleEnum.MANAGER) return true;

    const comment = await this.findOne(commentId);
    if (comment.user.id !== user.id) {
      throw new ForbiddenException('You can only modify your own comments');
    }
    return true;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, user: any) {
    await this.canModifyComment(id, user);

    const comment = await this.findOne(id);
    if (updateCommentDto.comment) {
      comment.comment = updateCommentDto.comment;
    }
    return this.commentRepository.save(comment);
  }

  async remove(id: number, user: any) {
    await this.canModifyComment(id, user);

    const comment = await this.findOne(id);
    return this.commentRepository.remove(comment);
  }
}
