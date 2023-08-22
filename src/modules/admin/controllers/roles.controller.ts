import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { UserType } from '../../shared/enums/user-type.enum';
import { PermissionsGroups } from '../enums/permissions-groups.enum';
import { PermissionsTarget } from '../../../core/metadata/permissions-target.metadata';
import { RolesService } from '../services/roles.service';
import { AdminMustCanDo } from '../../../core/metadata/admin-must-can-do.metadata';
import { PermissionsActions } from '../enums/permissions-actions.enum';
import { RoleDto } from '../dtos/role.dto';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionsGroups.ROLES)
@Controller('admin/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @AdminMustCanDo(PermissionsActions.CREATE)
  @Serialize(RoleDto, 'Role created successfully.')
  @Post()
  async create(@Body() createAdDto: CreateRoleDto) {
    return this.rolesService.create(createAdDto);
  }

  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(RoleDto, 'All roles.')
  @Get()
  async findAll() {
    return this.rolesService.findAll();
  }

  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(RoleDto, 'One role.')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const role = await this.rolesService.findOneById(id);
    if (!role) {
      throw new NotFoundException('Role not found.');
    }
    return role;
  }

  @AdminMustCanDo(PermissionsActions.UPDATE)
  @Serialize(RoleDto, 'Role updated successfully.')
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @AdminMustCanDo(PermissionsActions.DELETE)
  @Serialize(RoleDto, 'Role deleted successfully.')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.rolesService.remove(id);
  }
}
