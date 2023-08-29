import { Body, Controller, Patch, Post } from '@nestjs/common';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { Public } from '../../../../core/metadata/public.metadata';
import { SignInWithEmailAndPasswordDto } from '../dtos/auth/sign-in-with-email-and-password.dto';
import { AuthService } from '../services/auth.service';
import { AdminDto } from '../dtos/admins/admin.dto';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { UserType } from '../../../shared/enums/user-type.enum';
import { ChangePasswordDto } from '../dtos/auth/change-password.dto';
import { GetAuthedUser } from '../../../../core/custom-decorators/get-authed-user.decorator';
import { AuthedUser } from '../../../../core/types/authed-user.type';
import { Admin } from '../../entities/admin.entity';

@Controller({ path: 'admin/auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Serialize(AdminDto, 'You signed in successfully.')
  @Post('sign-in-with-email-and-password')
  signInWithEmailAndPassword(@Body() signInWithEmailAndPasswordDto: SignInWithEmailAndPasswordDto): Promise<any> {
    return this.authService.signInWithEmailAndPassword(signInWithEmailAndPasswordDto);
  }

  @AllowFor(UserType.ADMIN)
  @Serialize(AdminDto, 'Password changed successfully.')
  @Patch('change-password')
  changePassword(@GetAuthedUser() authedUser: AuthedUser, @Body() changePasswordDto: ChangePasswordDto): Promise<Admin> {
    return this.authService.changePassword(authedUser.id, changePasswordDto);
  }
}
