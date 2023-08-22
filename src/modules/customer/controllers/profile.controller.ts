import { Body, Controller, Patch } from '@nestjs/common';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { UserType } from '../../shared/enums/user-type.enum';
import { ProfileService } from '../services/profile.service';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { CustomerDto } from '../../shared/dtos/customer.dto';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { AuthedUser } from '../../../core/types/authed-user.type';
import { GetAuthedUser } from '../../../core/custom-decorators/get-authed-user.decorator';

@AllowFor(UserType.CUSTOMER)
@Controller('customer/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Serialize(CustomerDto, 'Profile updated successfully.')
  @Patch()
  findAll(
    @GetAuthedUser() authedUser: AuthedUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.update(authedUser.id, updateProfileDto);
  }
}
