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
import { ReasonsService } from '../services/reasons.service';
import { UserType } from '../../shared/enums/user-type.enum';
import { ReasonDto } from '../../shared/dtos/reason.dto';
import { PermissionsTarget } from '../../../core/metadata/permissions-target.metadata';
import { PermissionsGroups } from '../enums/permissions-groups.enum';
import { AdminMustCanDo } from '../../../core/metadata/admin-must-can-do.metadata';
import { PermissionsActions } from '../enums/permissions-actions.enum';
import { CreateReasonDto } from '../dtos/create-reason.dto';
import { UpdateReasonDto } from '../dtos/update-reason.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionsGroups.REASONS)
@Controller('admin/reasons')
export class ReasonsController {
  constructor(private readonly reasonsService: ReasonsService) {}

  @AdminMustCanDo(PermissionsActions.CREATE)
  @Serialize(ReasonDto, 'Reason created successfully.')
  @Post()
  async create(@Body() createReasonDto: CreateReasonDto) {
    return this.reasonsService.create(createReasonDto);
  }

  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(ReasonDto, 'All reasons.')
  @Get()
  findAll() {
    return this.reasonsService.findAll();
  }

  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(ReasonDto, 'One reason.')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const reason = await this.reasonsService.findOneById(id);
    if (!reason) {
      throw new NotFoundException('Reason not found.');
    }
    return reason;
  }

  @AdminMustCanDo(PermissionsActions.UPDATE)
  @Serialize(ReasonDto, 'Reason updated successfully.')
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateReasonDto: UpdateReasonDto,
  ) {
    return this.reasonsService.update(id, updateReasonDto);
  }

  @AdminMustCanDo(PermissionsActions.DELETE)
  @Serialize(ReasonDto, 'Reason deleted successfully.')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.reasonsService.remove(id);
  }
}
