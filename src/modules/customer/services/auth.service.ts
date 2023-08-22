import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../../shared/enums/user-type.enum';
import { CheckPhoneDto } from '../../shared/dtos/check-phone.dto';
import { SignInWithPhoneDto } from '../../shared/dtos/sign-in-with-phone.dto';
import { SignUpDto } from '../dtos/sign-up.dto';
import { CustomersService } from './customers.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly customersService: CustomersService,
    private readonly jwtService: JwtService,
  ) {}

  // check phone.
  async checkPhone(checkPhoneDto: CheckPhoneDto) {
    const customer = await this.customersService.findOneByPhone(
      checkPhoneDto.phone,
    );
    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }
    return customer;
  }

  // sign in with phone.
  async signInWithPhone(signInWithPhoneDto: SignInWithPhoneDto) {
    const customer = await this.customersService.findOneByPhone(
      signInWithPhoneDto.phone,
    );
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const accessToken = await this.jwtService.signAsync({
      id: customer.id,
      type: UserType.CUSTOMER,
    });
    return { ...customer, accessToken };
  }

  // sign up.
  signUp(signUpDto: SignUpDto) {
    return this.customersService.create(signUpDto);
  }

  // delete account.
  deleteAccount(customerId: number) {
    return this.customersService.remove(customerId);
  }
}
