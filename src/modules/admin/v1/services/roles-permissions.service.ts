import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesPermissions } from '../../entities/roles-permissions.entity';

@Injectable()
export class RolesPermissionsService {
  constructor(
    @InjectRepository(RolesPermissions)
    private readonly rolesPermissionsRepository: Repository<RolesPermissions>,
  ) {}

  // remove all by role id.
  async removeAllByRoleId(roleId: number): Promise<void> {
    const rolesPermissions: RolesPermissions[] = await this.rolesPermissionsRepository.find({ where: { roleId } });
    for (const rolePermission of rolesPermissions) {
      await this.rolesPermissionsRepository.remove(rolePermission);
    }
  }
}
