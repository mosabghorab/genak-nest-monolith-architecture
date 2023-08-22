import { Body, Controller, Delete, Post } from '@nestjs/common';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { AuthService } from '../services/auth.service';
import { CheckPhoneDto } from '../../shared/dtos/check-phone.dto';
import { SignInWithPhoneDto } from '../../shared/dtos/sign-in-with-phone.dto';
import { SignUpDto } from '../dtos/sign-up.dto';
import { CustomerDto } from '../../shared/dtos/customer.dto';
import { GetAuthedUser } from '../../../core/custom-decorators/get-authed-user.decorator';
import { AuthedUser } from '../../../core/types/authed-user.type';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { UserType } from '../../shared/enums/user-type.enum';
import { Public } from '../../../core/metadata/public.metadata';

@Controller('customer/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Serialize(CustomerDto, 'Phone is exist.')
  @Post('check-phone')
  async checkPhone(@Body() checkPhoneDto: CheckPhoneDto) {
    return this.authService.checkPhone(checkPhoneDto);
  }

  @Public()
  @Serialize(CustomerDto, 'You signed in successfully.')
  @Post('sign-in-with-phone')
  async signInWithPhone(@Body() signInWithPhoneDto: SignInWithPhoneDto) {
    return this.authService.signInWithPhone(signInWithPhoneDto);
  }

  @Public()
  @Serialize(CustomerDto, 'You signed up successfully.')
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @AllowFor(UserType.CUSTOMER)
  @Serialize(CustomerDto, 'Account deleted successfully.')
  @Delete('delete-account')
  async deleteAccount(@GetAuthedUser() authedUser: AuthedUser) {
    return this.authService.deleteAccount(authedUser.id);
  }
}
