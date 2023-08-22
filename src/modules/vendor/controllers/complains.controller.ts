import { Body, Controller, Post, UploadedFiles } from '@nestjs/common';
import { UserType } from '../../shared/enums/user-type.enum';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { GetAuthedUser } from '../../../core/custom-decorators/get-authed-user.decorator';
import { AuthedUser } from '../../../core/types/authed-user.type';
import { ComplainsService } from '../services/complains.service';
import { ComplainDto } from '../../shared/dtos/complain.dto';
import { CreateComplainDto } from '../dtos/create-complain.dto';
import { CreateComplainUploadedFilesDto } from '../dtos/create-complain-uploaded-files.dto';

@AllowFor(UserType.VENDOR)
@Controller('vendor/complains')
export class ComplainsController {
  constructor(private readonly complainsService: ComplainsService) {}

  @Serialize(ComplainDto, 'Complain created successfully.')
  @Post()
  create(
    @GetAuthedUser() authedUser: AuthedUser,
    @Body() createComplainDto: CreateComplainDto,
    @UploadedFiles()
    createComplainUploadedFilesDto: CreateComplainUploadedFilesDto,
  ) {
    return this.complainsService.create(
      authedUser.id,
      createComplainDto,
      createComplainUploadedFilesDto,
    );
  }
}
