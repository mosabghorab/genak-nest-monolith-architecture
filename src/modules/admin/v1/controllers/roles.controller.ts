import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { UserType } from '../../../shared/enums/user-type.enum';
import { PermissionGroup } from '../../enums/permission-group.enum';
import { PermissionsTarget } from '../../../../core/metadata/permissions-target.metadata';
import { RolesService } from '../services/roles.service';
import { AdminMustCanDo } from '../../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../../enums/permission-action.enum';
import { RoleDto } from '../dtos/roles/role.dto';
import { CreateRoleDto } from '../dtos/roles/create-role.dto';
import { UpdateRoleDto } from '../dtos/roles/update-role.dto';
import { Role } from '../../entities/role.entity';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ROLES)
@Controller({ path: 'admin/roles', version: '1' })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(RoleDto, 'Role created successfully.')
  @Post()
  create(@Body() createAdDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(createAdDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(RoleDto, 'All roles.')
  @Get()
  findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(RoleDto, 'One role.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Role> {
    return this.rolesService.findOneOrFailById(id);
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(RoleDto, 'Role updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto): Promise<Role> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(RoleDto, 'Role deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Role> {
    return this.rolesService.remove(id);
  }
}
