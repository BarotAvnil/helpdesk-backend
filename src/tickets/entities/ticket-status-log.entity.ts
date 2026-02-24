import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { User } from '../../users/entities/user.entity';
import { TicketStatus } from '../../tickets/enums/ticket.enum';

@Entity('ticket_status_logs')
export class TicketStatusLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Ticket, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @Column({ type: 'enum', enum: TicketStatus, name: 'old_status' })
  oldStatus: TicketStatus;

  @Column({ type: 'enum', enum: TicketStatus, name: 'new_status' })
  newStatus: TicketStatus;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'changed_by' })
  changedBy: User;

  @CreateDateColumn({ name: 'changed_at' })
  changedAt: Date;
}
