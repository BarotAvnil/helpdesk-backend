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
  SetMetadata,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RoleEnum } from '../roles/enums/role.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @SetMetadata('roles', [RoleEnum.USER, RoleEnum.MANAGER])
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully.' })
  create(@Body() createTicketDto: CreateTicketDto, @Req() req: any) {
    return this.ticketsService.create(createTicketDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get tickets based on role' })
  @ApiResponse({ status: 200, description: 'Lists available tickets.' })
  findAll(@Req() req: any) {
    return this.ticketsService.findAll(req.user);
  }

  @Patch(':id/assign')
  @SetMetadata('roles', [RoleEnum.MANAGER, RoleEnum.SUPPORT])
  @ApiOperation({ summary: 'Assign a ticket to SUPPORT or MANAGER' })
  @ApiResponse({ status: 200, description: 'Ticket assigned successfully.' })
  assignTicket(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignTicketDto: AssignTicketDto,
  ) {
    return this.ticketsService.assign(id, assignTicketDto.userId);
  }

  @Patch(':id/status')
  @SetMetadata('roles', [RoleEnum.MANAGER, RoleEnum.SUPPORT])
  @ApiOperation({ summary: 'Update ticket status and log it' })
  @ApiResponse({ status: 200, description: 'Status updated.' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateTicketStatusDto,
    @Req() req: any,
  ) {
    return this.ticketsService.updateStatus(
      id,
      updateStatusDto.status,
      req.user,
    );
  }

  @Delete(':id')
  @SetMetadata('roles', [RoleEnum.MANAGER])
  @ApiOperation({ summary: 'Delete a ticket (MANAGER only)' })
  @ApiResponse({ status: 200, description: 'Ticket deleted.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.remove(id);
  }
}
