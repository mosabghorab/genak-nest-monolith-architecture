import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../../shared/enums/user-type.enum';
import { VendorsService } from './vendors.service';
import { CheckPhoneDto } from '../../shared/dtos/check-phone.dto';
import { SignInWithPhoneDto } from '../../shared/dtos/sign-in-with-phone.dto';
import { SignUpDto } from '../dtos/sign-up.dto';
import { SignUpUploadedFilesDto } from '../dtos/sign-up-uploaded-files.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly vendorsService: VendorsService,
  ) {}

  // check phone.
  async checkPhone(checkPhoneDto: CheckPhoneDto) {
    const vendor = await this.vendorsService.findOneByPhone(
      checkPhoneDto.phone,
    );
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  // sign in with phone.
  async signInWithPhone(signInWithPhoneDto: SignInWithPhoneDto) {
    const vendor = await this.vendorsService.findOneByPhone(
      signInWithPhoneDto.phone,
    );
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    const accessToken = await this.jwtService.signAsync({
      id: vendor.id,
      type: UserType.VENDOR,
    });
    return { ...vendor, accessToken };
  }

  // sign up.
  signUp(signUpDto: SignUpDto, signUpUploadedFilesDto: SignUpUploadedFilesDto) {
    return this.vendorsService.create(signUpDto, signUpUploadedFilesDto);
  }

  // upload documents.
  async uploadDocuments(vendorId: number, uploadedFiles?: any) {
    return this.vendorsService.uploadDocuments(vendorId, uploadedFiles);
  }

  // delete account.
  deleteAccount(vendorId: number) {
    return this.vendorsService.remove(vendorId);
  }
}
