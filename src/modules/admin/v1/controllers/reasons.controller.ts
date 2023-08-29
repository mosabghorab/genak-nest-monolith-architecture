import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { ReasonsService } from '../services/reasons.service';
import { UserType } from '../../../shared/enums/user-type.enum';
import { ReasonDto } from '../../../shared/v1/dtos/reason.dto';
import { PermissionsTarget } from '../../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../../enums/permission-group.enum';
import { AdminMustCanDo } from '../../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../../enums/permission-action.enum';
import { CreateReasonDto } from '../dtos/reasons/create-reason.dto';
import { UpdateReasonDto } from '../dtos/reasons/update-reason.dto';
import { Reason } from '../../../shared/entities/reason.entity';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.REASONS)
@Controller({ path: 'admin/reasons', version: '1' })
export class ReasonsController {
  constructor(private readonly reasonsService: ReasonsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(ReasonDto, 'Reason created successfully.')
  @Post()
  create(@Body() createReasonDto: CreateReasonDto): Promise<Reason> {
    return this.reasonsService.create(createReasonDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(ReasonDto, 'All reasons.')
  @Get()
  findAll(): Promise<Reason[]> {
    return this.reasonsService.findAll();
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(ReasonDto, 'One reason.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Reason> {
    return this.reasonsService.findOneOrFailById(id);
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(ReasonDto, 'Reason updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateReasonDto: UpdateReasonDto): Promise<Reason> {
    return this.reasonsService.update(id, updateReasonDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(ReasonDto, 'Reason deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Reason> {
    return this.reasonsService.remove(id);
  }
}
