import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminsRoles } from '../../entities/admins-roles.entity';

@Injectable()
export class AdminsRolesService {
  constructor(
    @InjectRepository(AdminsRoles)
    private readonly adminsRolesRepository: Repository<AdminsRoles>,
  ) {}

  // remove all by admin id.
  async removeAllByAdminId(adminId: number): Promise<void> {
    const adminsRoles: AdminsRoles[] = await this.adminsRolesRepository.find({
      where: { adminId: adminId },
    });
    for (const adminsRole of adminsRoles) {
      await this.adminsRolesRepository.remove(adminsRole);
    }
  }
}
