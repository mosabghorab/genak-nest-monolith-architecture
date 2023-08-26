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
  UploadedFiles,
} from '@nestjs/common';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { UserType } from '../../shared/enums/user-type.enum';
import { PermissionsTarget } from '../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../enums/permission-group.enum';
import { AdminMustCanDo } from '../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../enums/permission-action.enum';
import { OnBoardingScreensService } from '../services/on-boarding-screens.service';
import { CreateOnBoardingScreenDto } from '../dtos/create-on-boarding-screen.dto';
import { CreateOnBoardingScreenUploadedFilesDto } from '../dtos/create-on-boarding-screen-uploaded-files.dto';
import { OnBoardingScreenDto } from '../../shared/dtos/on-boarding-screen.dto';
import { FindAllOnBoardingScreensDto } from '../dtos/find-all-on-boarding-screens.dto';
import { UpdateOnBoardingScreenDto } from '../dtos/update-on-boarding-screen.dto';
import { UpdateOnBoardingScreenUploadedFilesDto } from '../dtos/update-on-boarding-screen-uploaded-files.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ON_BOARDING_SCREENS)
@Controller('admin/on-boarding-screens')
export class OnBoardingScreensController {
  constructor(
    private readonly onBoardingScreensService: OnBoardingScreensService,
  ) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(OnBoardingScreenDto, 'On boarding screen created successfully.')
  @Post()
  async create(
    @Body() createOnBoardingScreenDto: CreateOnBoardingScreenDto,
    @UploadedFiles()
    createOnBoardingScreenUploadedFilesDto: CreateOnBoardingScreenUploadedFilesDto,
  ) {
    return this.onBoardingScreensService.create(
      createOnBoardingScreenDto,
      createOnBoardingScreenUploadedFilesDto,
    );
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(OnBoardingScreenDto, 'All on boarding screens.')
  @Get()
  findAll(@Query() findAllOnBoardingScreensDto: FindAllOnBoardingScreensDto) {
    return this.onBoardingScreensService.findAll(findAllOnBoardingScreensDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(OnBoardingScreenDto, 'One on boarding screen.')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const onBoardingScreen = await this.onBoardingScreensService.findOneById(
      id,
    );
    if (!onBoardingScreen) {
      throw new NotFoundException('On boarding screen not found.');
    }
    return onBoardingScreen;
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(OnBoardingScreenDto, 'On boarding screen updated successfully.')
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateOnBoardingScreenDto: UpdateOnBoardingScreenDto,
    @UploadedFiles()
    updateOnBoardingScreenUploadedFilesDto: UpdateOnBoardingScreenUploadedFilesDto,
  ) {
    return this.onBoardingScreensService.update(
      id,
      updateOnBoardingScreenDto,
      updateOnBoardingScreenUploadedFilesDto,
    );
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(OnBoardingScreenDto, 'On boarding screen deleted successfully.')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.onBoardingScreensService.remove(id);
  }
}
