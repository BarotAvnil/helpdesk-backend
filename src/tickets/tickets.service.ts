import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketStatusLog } from './entities/ticket-status-log.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketStatus } from './enums/ticket.enum';
import { RoleEnum } from '../roles/enums/role.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketStatusLog)
    private statusLogRepository: Repository<TicketStatusLog>,
    private usersService: UsersService,
  ) {}

  async create(createTicketDto: CreateTicketDto, user: any) {
    const creator = await this.usersService.findById(user.id);
    const ticket = this.ticketRepository.create({
      ...createTicketDto,
      createdBy: creator,
    });
    return this.ticketRepository.save(ticket);
  }

  async findAll(user: any) {
    if (user.role === RoleEnum.MANAGER) {
      return this.ticketRepository.find({
        relations: ['createdBy', 'assignedTo'],
      });
    } else if (user.role === RoleEnum.SUPPORT) {
      return this.ticketRepository.find({
        where: { assignedTo: { id: user.id } },
        relations: ['createdBy', 'assignedTo'],
      });
    } else {
      return this.ticketRepository.find({
        where: { createdBy: { id: user.id } },
        relations: ['createdBy', 'assignedTo'],
      });
    }
  }

  async findOne(id: number) {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['createdBy', 'assignedTo'],
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket #${id} not found`);
    }
    return ticket;
  }

  async assign(ticketId: number, userId: number) {
    const ticket = await this.findOne(ticketId);
    const assignee = await this.usersService.findById(userId);

    if (assignee.role.name === RoleEnum.USER) {
      throw new BadRequestException(
        'Cannot assign ticket to a user with role USER',
      );
    }

    ticket.assignedTo = assignee;
    return this.ticketRepository.save(ticket);
  }

  async updateStatus(ticketId: number, newStatus: TicketStatus, user: any) {
    const ticket = await this.findOne(ticketId);
    const oldStatus = ticket.status;

    const validTransitions: Record<TicketStatus, TicketStatus[]> = {
      [TicketStatus.OPEN]: [
        TicketStatus.IN_PROGRESS,
        TicketStatus.RESOLVED,
        TicketStatus.CLOSED,
      ],
      [TicketStatus.IN_PROGRESS]: [TicketStatus.RESOLVED, TicketStatus.CLOSED],
      [TicketStatus.RESOLVED]: [TicketStatus.CLOSED],
      [TicketStatus.CLOSED]: [],
    };

    if (!validTransitions[oldStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${oldStatus} to ${newStatus}`,
      );
    }

    ticket.status = newStatus;
    const updatedTicket = await this.ticketRepository.save(ticket);

    const changedBy = await this.usersService.findById(user.id);
    const log = this.statusLogRepository.create({
      ticket: updatedTicket,
      oldStatus,
      newStatus,
      changedBy,
    });
    await this.statusLogRepository.save(log);

    return updatedTicket;
  }

  async remove(id: number) {
    const ticket = await this.findOne(id);
    return this.ticketRepository.remove(ticket);
  }
}
