import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { RolesPermissionsService } from './roles-permissions.service';
import { RolesPermissions } from '../entities/roles-permissions.entity';
import { FindOptionsRelations } from 'typeorm/browser';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly rolesPermissionsService: RolesPermissionsService,
  ) {}

  // create.
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = await this.roleRepository.create(createRoleDto);
    const savedRole = await this.roleRepository.save(role);
    savedRole.rolesPermissions = createRoleDto.permissionsIds.map(
      (permissionId) =>
        <RolesPermissions>{
          roleId: savedRole.id,
          permissionId,
        },
    );
    return this.roleRepository.save(role);
  }

  // find all.
  findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  // find one by id.
  findOneById(
    id: number,
    relations?: FindOptionsRelations<Role>,
  ): Promise<Role> {
    return this.roleRepository.findOne({
      where: { id },
      relations,
    });
  }

  // update.
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOneById(id, { rolesPermissions: true });
    if (!role) {
      throw new NotFoundException('Role not found.');
    }
    if (updateRoleDto.permissionsIds) {
      await this.rolesPermissionsService.removeByRoleId(role.id);
      role.rolesPermissions = updateRoleDto.permissionsIds.map(
        (permissionId) =>
          <RolesPermissions>{
            roleId: role.id,
            permissionId,
          },
      );
    }
    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  // remove.
  async remove(id: number): Promise<Role> {
    const role = await this.findOneById(id);
    if (!role) {
      throw new BadRequestException('Role not found.');
    }
    return this.roleRepository.remove(role);
  }
}
