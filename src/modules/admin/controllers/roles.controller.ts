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
import { PermissionGroup } from '../enums/permission-group.enum';
import { PermissionsTarget } from '../../../core/metadata/permissions-target.metadata';
import { RolesService } from '../services/roles.service';
import { AdminMustCanDo } from '../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../enums/permission-action.enum';
import { RoleDto } from '../dtos/role.dto';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ROLES)
@Controller('admin/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(RoleDto, 'Role created successfully.')
  @Post()
  async create(@Body() createAdDto: CreateRoleDto) {
    return this.rolesService.create(createAdDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(RoleDto, 'All roles.')
  @Get()
  async findAll() {
    return this.rolesService.findAll();
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(RoleDto, 'One role.')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const role = await this.rolesService.findOneById(id);
    if (!role) {
      throw new NotFoundException('Role not found.');
    }
    return role;
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(RoleDto, 'Role updated successfully.')
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(RoleDto, 'Role deleted successfully.')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.rolesService.remove(id);
  }
}
