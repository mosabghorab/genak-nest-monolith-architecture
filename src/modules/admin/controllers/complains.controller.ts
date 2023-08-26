import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UserType } from '../../shared/enums/user-type.enum';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { ComplainsService } from '../services/complains.service';
import { AdminMustCanDo } from '../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../enums/permission-action.enum';
import { PermissionsTarget } from '../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../enums/permission-group.enum';
import { ComplainsPaginationDto } from '../dtos/complains-pagination.dto';
import { FindAllComplainsDto } from '../dtos/find-all-complains.dto';
import { ComplainDto } from '../../shared/dtos/complain.dto';
import { UpdateComplainStatusDto } from '../dtos/update-complain-status.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.COMPLAINS)
@Controller('admin/complains')
export class ComplainsController {
  constructor(private readonly complainsService: ComplainsService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(ComplainsPaginationDto, 'All complains.')
  @Get()
  findAll(@Query() findAllComplainsDto: FindAllComplainsDto) {
    return this.complainsService.findAll(findAllComplainsDto);
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(ComplainDto, 'Complain status updated successfully.')
  @Patch(':id/update-status')
  async updateStatus(
    @Param('id') id: number,
    @Body() updateComplainStatusDto: UpdateComplainStatusDto,
  ) {
    return this.complainsService.updateStatus(id, updateComplainStatusDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(ComplainDto, 'Complain deleted successfully.')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.complainsService.remove(id);
  }
}
