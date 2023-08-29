import { Body, Controller, Delete, Post } from '@nestjs/common';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { AuthService } from '../services/auth.service';
import { CheckPhoneDto } from '../../../shared/v1/dtos/check-phone.dto';
import { SignInWithPhoneDto } from '../../../shared/v1/dtos/sign-in-with-phone.dto';
import { SignUpDto } from '../dtos/sign-up.dto';
import { CustomerDto } from '../../../shared/v1/dtos/customer.dto';
import { GetAuthedUser } from '../../../../core/custom-decorators/get-authed-user.decorator';
import { AuthedUser } from '../../../../core/types/authed-user.type';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { UserType } from '../../../shared/enums/user-type.enum';
import { Public } from '../../../../core/metadata/public.metadata';
import { Customer } from '../../../shared/entities/customer.entity';

@Controller({ path: 'customer/auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Serialize(CustomerDto, 'Phone is exist.')
  @Post('check-phone')
  async checkPhone(@Body() checkPhoneDto: CheckPhoneDto): Promise<Customer> {
    return this.authService.checkPhone(checkPhoneDto);
  }

  @Public()
  @Serialize(CustomerDto, 'You signed in successfully.')
  @Post('sign-in-with-phone')
  async signInWithPhone(@Body() signInWithPhoneDto: SignInWithPhoneDto): Promise<any> {
    return this.authService.signInWithPhone(signInWithPhoneDto);
  }

  @Public()
  @Serialize(CustomerDto, 'You signed up successfully.')
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<Customer> {
    return this.authService.signUp(signUpDto);
  }

  @AllowFor(UserType.CUSTOMER)
  @Serialize(CustomerDto, 'Account deleted successfully.')
  @Delete('delete-account')
  async deleteAccount(@GetAuthedUser() authedUser: AuthedUser): Promise<Customer> {
    return this.authService.deleteAccount(authedUser.id);
  }
}
