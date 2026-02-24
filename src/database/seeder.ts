import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { RoleEnum } from '../roles/enums/role.enum';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Seeder implements OnModuleInit {
  private readonly logger = new Logger(Seeder.name);

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    this.logger.log('Seeding Database Initialization...');
    await this.seedRoles();
    await this.seedManager();
    this.logger.log('Database Initialization Complete.');
  }

  private async seedRoles() {
    for (const roleName of Object.values(RoleEnum)) {
      const exists = await this.roleRepository.findOne({
        where: { name: roleName },
      });
      if (!exists) {
        const newRole = this.roleRepository.create({ name: roleName });
        await this.roleRepository.save(newRole);
        this.logger.log(`Seeded Role: ${roleName}`);
      }
    }
  }

  private async seedManager() {
    const managerRole = await this.roleRepository.findOne({
      where: { name: RoleEnum.MANAGER },
    });
    if (!managerRole) {
      this.logger.error('MANAGER role not found for user seeding!');
      return;
    }

    const adminExists = await this.userRepository.findOne({
      where: { email: 'admin@helpdesk.com' },
    });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = this.userRepository.create({
        name: 'System Admin',
        email: 'admin@helpdesk.com',
        password: hashedPassword,
        role: managerRole,
      });
      await this.userRepository.save(admin);
      this.logger.log(
        'Seeded Admin MANAGER user: admin@helpdesk.com / admin123',
      );
    }
  }
}
