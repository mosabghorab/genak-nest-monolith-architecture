import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../../../shared/enums/user-type.enum';
import { VendorsService } from './vendors.service';
import { CheckPhoneDto } from '../../../shared/v1/dtos/check-phone.dto';
import { SignInWithPhoneDto } from '../../../shared/v1/dtos/sign-in-with-phone.dto';
import { SignUpDto } from '../dtos/sign-up.dto';
import { SignUpUploadedFilesDto } from '../dtos/sign-up-uploaded-files.dto';
import { Vendor } from '../../../shared/entities/vendor.entity';
import { AuthedUser } from '../../../../core/types/authed-user.type';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly vendorsService: VendorsService) {}

  // check phone.
  checkPhone(checkPhoneDto: CheckPhoneDto): Promise<Vendor> {
    return this.vendorsService.findOneOrFailByPhone(checkPhoneDto.phone);
  }

  // sign in with phone.
  async signInWithPhone(signInWithPhoneDto: SignInWithPhoneDto): Promise<any> {
    const vendor: Vendor = await this.vendorsService.findOneOrFailByPhone(signInWithPhoneDto.phone);
    const accessToken: string = await this.jwtService.signAsync(<AuthedUser>{
      id: vendor.id,
      type: UserType.VENDOR,
    });
    return { ...vendor, accessToken };
  }

  // sign up.
  signUp(signUpDto: SignUpDto, signUpUploadedFilesDto: SignUpUploadedFilesDto): Promise<Vendor> {
    return this.vendorsService.create(signUpDto, signUpUploadedFilesDto);
  }

  // upload documents.
  uploadDocuments(vendorId: number, uploadedFiles?: any): Promise<Vendor> {
    return this.vendorsService.uploadDocuments(vendorId, uploadedFiles);
  }

  // delete account.
  deleteAccount(vendorId: number): Promise<Vendor> {
    return this.vendorsService.remove(vendorId);
  }
}
