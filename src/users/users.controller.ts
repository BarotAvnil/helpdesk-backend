import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RoleEnum } from '../roles/enums/role.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @SetMetadata('roles', [RoleEnum.MANAGER])
  @ApiOperation({ summary: 'Create a new user (MANAGER only)' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. MANAGER role required.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @SetMetadata('roles', [RoleEnum.MANAGER])
  @ApiOperation({ summary: 'Get all users (MANAGER only)' })
  @ApiResponse({ status: 200, description: 'Return array of users.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. MANAGER role required.',
  })
  findAll() {
    return this.usersService.findAll();
  }
}
