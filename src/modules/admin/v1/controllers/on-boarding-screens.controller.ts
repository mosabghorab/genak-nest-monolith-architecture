import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles } from '@nestjs/common';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { UserType } from '../../../shared/enums/user-type.enum';
import { PermissionsTarget } from '../../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../../enums/permission-group.enum';
import { AdminMustCanDo } from '../../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../../enums/permission-action.enum';
import { OnBoardingScreensService } from '../services/on-boarding-screens.service';
import { CreateOnBoardingScreenDto } from '../dtos/on-boarding-screens/create-on-boarding-screen.dto';
import { CreateOnBoardingScreenUploadedFilesDto } from '../dtos/on-boarding-screens/create-on-boarding-screen-uploaded-files.dto';
import { OnBoardingScreenDto } from '../../../shared/v1/dtos/on-boarding-screen.dto';
import { FindAllOnBoardingScreensDto } from '../dtos/on-boarding-screens/find-all-on-boarding-screens.dto';
import { UpdateOnBoardingScreenDto } from '../dtos/on-boarding-screens/update-on-boarding-screen.dto';
import { UpdateOnBoardingScreenUploadedFilesDto } from '../dtos/on-boarding-screens/update-on-boarding-screen-uploaded-files.dto';
import { OnBoardingScreen } from '../../../shared/entities/on-boarding-screen.entity';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ON_BOARDING_SCREENS)
@Controller({ path: 'admin/on-boarding-screens', version: '1' })
export class OnBoardingScreensController {
  constructor(private readonly onBoardingScreensService: OnBoardingScreensService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(OnBoardingScreenDto, 'On boarding screen created successfully.')
  @Post()
  create(
    @Body() createOnBoardingScreenDto: CreateOnBoardingScreenDto,
    @UploadedFiles()
    createOnBoardingScreenUploadedFilesDto: CreateOnBoardingScreenUploadedFilesDto,
  ): Promise<OnBoardingScreen> {
    return this.onBoardingScreensService.create(createOnBoardingScreenDto, createOnBoardingScreenUploadedFilesDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(OnBoardingScreenDto, 'All on boarding screens.')
  @Get()
  findAll(@Query() findAllOnBoardingScreensDto: FindAllOnBoardingScreensDto): Promise<OnBoardingScreen[]> {
    return this.onBoardingScreensService.findAll(findAllOnBoardingScreensDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(OnBoardingScreenDto, 'One on boarding screen.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<OnBoardingScreen> {
    return this.onBoardingScreensService.findOneOrFailById(id);
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(OnBoardingScreenDto, 'On boarding screen updated successfully.')
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateOnBoardingScreenDto: UpdateOnBoardingScreenDto,
    @UploadedFiles()
    updateOnBoardingScreenUploadedFilesDto: UpdateOnBoardingScreenUploadedFilesDto,
  ): Promise<OnBoardingScreen> {
    return this.onBoardingScreensService.update(id, updateOnBoardingScreenDto, updateOnBoardingScreenUploadedFilesDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(OnBoardingScreenDto, 'On boarding screen deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<OnBoardingScreen> {
    return this.onBoardingScreensService.remove(id);
  }
}
