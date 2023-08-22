import { Body, Controller, Patch, UploadedFiles } from '@nestjs/common';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { UserType } from '../../shared/enums/user-type.enum';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { AuthedUser } from '../../../core/types/authed-user.type';
import { GetAuthedUser } from '../../../core/custom-decorators/get-authed-user.decorator';
import { VendorDto } from '../../shared/dtos/vendor.dto';
import { ProfileService } from '../services/profile.service';
import { UpdateProfileUploadedFilesDto } from '../dtos/update-profile-uploaded-files.dto';

@AllowFor(UserType.VENDOR)
@Controller('vendor/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Serialize(VendorDto, 'Profile updated successfully.')
  @Patch()
  findAll(
    @GetAuthedUser() authedUser: AuthedUser,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFiles()
    updateProfileUploadedFilesDto: UpdateProfileUploadedFilesDto,
  ) {
    return this.profileService.update(
      authedUser.id,
      updateProfileDto,
      updateProfileUploadedFilesDto,
    );
  }
}
