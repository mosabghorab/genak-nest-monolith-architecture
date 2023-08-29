import { Body, Controller, Post, UploadedFiles } from '@nestjs/common';
import { UserType } from '../../../shared/enums/user-type.enum';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { GetAuthedUser } from '../../../../core/custom-decorators/get-authed-user.decorator';
import { AuthedUser } from '../../../../core/types/authed-user.type';
import { ComplainsService } from '../services/complains.service';
import { ComplainDto } from '../../../shared/v1/dtos/complain.dto';
import { CreateComplainDto } from '../dtos/create-complain.dto';
import { CreateComplainUploadedFilesDto } from '../dtos/create-complain-uploaded-files.dto';
import { Complain } from '../../../shared/entities/complain.entity';

@AllowFor(UserType.VENDOR)
@Controller({ path: 'vendor/complains', version: '1' })
export class ComplainsController {
  constructor(private readonly complainsService: ComplainsService) {}

  @Serialize(ComplainDto, 'Complain created successfully.')
  @Post()
  create(
    @GetAuthedUser() authedUser: AuthedUser,
    @Body() createComplainDto: CreateComplainDto,
    @UploadedFiles()
    createComplainUploadedFilesDto: CreateComplainUploadedFilesDto,
  ): Promise<Complain> {
    return this.complainsService.create(authedUser.id, createComplainDto, createComplainUploadedFilesDto);
  }
}
