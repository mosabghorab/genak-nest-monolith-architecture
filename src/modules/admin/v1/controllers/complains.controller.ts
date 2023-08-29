import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { UserType } from '../../../shared/enums/user-type.enum';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { ComplainsService } from '../services/complains.service';
import { AdminMustCanDo } from '../../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../../enums/permission-action.enum';
import { PermissionsTarget } from '../../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../../enums/permission-group.enum';
import { ComplainsPaginationDto } from '../dtos/complains/complains-pagination.dto';
import { FindAllComplainsDto } from '../dtos/complains/find-all-complains.dto';
import { ComplainDto } from '../../../shared/v1/dtos/complain.dto';
import { UpdateComplainStatusDto } from '../dtos/complains/update-complain-status.dto';
import { Complain } from '../../../shared/entities/complain.entity';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.COMPLAINS)
@Controller({ path: 'admin/complains', version: '1' })
export class ComplainsController {
  constructor(private readonly complainsService: ComplainsService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(ComplainsPaginationDto, 'All complains.')
  @Get()
  findAll(@Query() findAllComplainsDto: FindAllComplainsDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Complain[];
    currentPage: number;
  }> {
    return this.complainsService.findAll(findAllComplainsDto);
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(ComplainDto, 'Complain status updated successfully.')
  @Patch(':id/update-status')
  updateStatus(@Param('id') id: number, @Body() updateComplainStatusDto: UpdateComplainStatusDto): Promise<Complain> {
    return this.complainsService.updateStatus(id, updateComplainStatusDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(ComplainDto, 'Complain deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Complain> {
    return this.complainsService.remove(id);
  }
}
