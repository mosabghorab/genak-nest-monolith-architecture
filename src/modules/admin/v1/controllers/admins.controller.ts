import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { UserType } from '../../../shared/enums/user-type.enum';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { PermissionGroup } from '../../enums/permission-group.enum';
import { PermissionAction } from '../../enums/permission-action.enum';
import { PermissionsTarget } from '../../../../core/metadata/permissions-target.metadata';
import { AdminMustCanDo } from '../../../../core/metadata/admin-must-can-do.metadata';
import { AdminsService } from '../services/admins.service';
import { AdminDto } from '../dtos/admins/admin.dto';
import { CreateAdminDto } from '../dtos/admins/create-admin.dto';
import { AdminsPaginationDto } from '../dtos/admins/admins-pagination.dto';
import { FindAllAdminsDto } from '../dtos/admins/find-all-admins.dto';
import { UpdateAdminDto } from '../dtos/admins/update-admin.dto';
import { Admin } from '../../entities/admin.entity';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ADMINS)
@Controller({ path: 'admin/admins', version: '1' })
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(AdminDto, 'Admin created successfully.')
  @Post()
  create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminsService.create(createAdminDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(AdminsPaginationDto, 'All admins.')
  @Get()
  findAll(@Query() findAllAdminsDto: FindAllAdminsDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Admin[];
    currentPage: number;
  }> {
    return this.adminsService.findAll(findAllAdminsDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(AdminDto, 'One admin.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Admin> {
    return this.adminsService.findOneOrFailById(id, null, {
      adminsRoles: { role: true },
    });
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(AdminDto, 'Admin updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAdminDto: UpdateAdminDto): Promise<Admin> {
    return this.adminsService.update(id, updateAdminDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(AdminDto, 'Admin deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Admin> {
    return this.adminsService.remove(id);
  }
}
