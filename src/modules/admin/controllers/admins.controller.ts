import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { UserType } from '../../shared/enums/user-type.enum';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { PermissionsGroups } from '../enums/permissions-groups.enum';
import { PermissionsActions } from '../enums/permissions-actions.enum';
import { PermissionsTarget } from '../../../core/metadata/permissions-target.metadata';
import { AdminMustCanDo } from '../../../core/metadata/admin-must-can-do.metadata';
import { AdminsService } from '../services/admins.service';
import { AdminDto } from '../dtos/admin.dto';
import { CreateAdminDto } from '../dtos/create-admin.dto';
import { AdminsPaginationDto } from '../dtos/admins-pagination.dto';
import { FindAllAdminsDto } from '../dtos/find-all-admins.dto';
import { UpdateAdminDto } from '../dtos/update-admin.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionsGroups.ADMINS)
@Controller('admin/admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @AdminMustCanDo(PermissionsActions.CREATE)
  @Serialize(AdminDto, 'Admin created successfully.')
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(AdminsPaginationDto, 'All admins.')
  @Get()
  findAll(@Query() findAllAdminsDto: FindAllAdminsDto) {
    return this.adminsService.findAll(findAllAdminsDto, {
      adminsRoles: { role: true },
    });
  }

  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(AdminDto, 'One admin.')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const admin = await this.adminsService.findOneById(id, {
      adminsRoles: { role: true },
    });
    if (!admin) {
      throw new NotFoundException('Admin not found.');
    }
    return admin;
  }

  @AdminMustCanDo(PermissionsActions.UPDATE)
  @Serialize(AdminDto, 'Admin updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(id, updateAdminDto);
  }

  @AdminMustCanDo(PermissionsActions.DELETE)
  @Serialize(AdminDto, 'Admin deleted successfully.')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.adminsService.remove(id);
  }
}
