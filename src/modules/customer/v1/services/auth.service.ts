import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../../../shared/enums/user-type.enum';
import { CheckPhoneDto } from '../../../shared/v1/dtos/check-phone.dto';
import { SignInWithPhoneDto } from '../../../shared/v1/dtos/sign-in-with-phone.dto';
import { SignUpDto } from '../dtos/sign-up.dto';
import { CustomersService } from './customers.service';
import { Customer } from '../../../shared/entities/customer.entity';
import { AuthedUser } from '../../../../core/types/authed-user.type';

@Injectable()
export class AuthService {
  constructor(private readonly customersService: CustomersService, private readonly jwtService: JwtService) {}

  // check phone.
  checkPhone(checkPhoneDto: CheckPhoneDto): Promise<Customer> {
    return this.customersService.findOneOrFailByPhone(checkPhoneDto.phone);
  }

  // sign in with phone.
  async signInWithPhone(signInWithPhoneDto: SignInWithPhoneDto): Promise<any> {
    const customer: Customer = await this.customersService.findOneOrFailByPhone(signInWithPhoneDto.phone);
    const accessToken: string = await this.jwtService.signAsync(<AuthedUser>{
      id: customer.id,
      type: UserType.CUSTOMER,
    });
    return { ...customer, accessToken };
  }

  // sign up.
  signUp(signUpDto: SignUpDto): Promise<Customer> {
    return this.customersService.create(signUpDto);
  }

  // delete account.
  deleteAccount(customerId: number): Promise<Customer> {
    return this.customersService.remove(customerId);
  }
}
