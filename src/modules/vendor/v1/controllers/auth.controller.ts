import { Body, Controller, Delete, Post, UploadedFiles } from '@nestjs/common';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { AuthService } from '../services/auth.service';
import { CheckPhoneDto } from '../../../shared/v1/dtos/check-phone.dto';
import { SignInWithPhoneDto } from '../../../shared/v1/dtos/sign-in-with-phone.dto';
import { Public } from '../../../../core/metadata/public.metadata';
import { VendorDto } from '../../../shared/v1/dtos/vendor.dto';
import { SignUpDto } from '../dtos/sign-up.dto';
import { SignUpUploadedFilesDto } from '../dtos/sign-up-uploaded-files.dto';
import { UserType } from '../../../shared/enums/user-type.enum';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { GetAuthedUser } from '../../../../core/custom-decorators/get-authed-user.decorator';
import { AuthedUser } from '../../../../core/types/authed-user.type';
import { Vendor } from '../../../shared/entities/vendor.entity';

@Controller({ path: 'vendor/auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Serialize(VendorDto, 'Phone is exist.')
  @Post('check-phone')
  checkPhone(@Body() checkPhoneDto: CheckPhoneDto): Promise<Vendor> {
    return this.authService.checkPhone(checkPhoneDto);
  }

  @Public()
  @Serialize(VendorDto, 'You signed in successfully.')
  @Post('sign-in-with-phone')
  signInWithPhone(@Body() signInWithPhoneDto: SignInWithPhoneDto): Promise<any> {
    return this.authService.signInWithPhone(signInWithPhoneDto);
  }

  @Public()
  @Serialize(VendorDto, 'You signed up successfully.')
  @Post('sign-up')
  signUp(
    @Body() signUpDto: SignUpDto,
    @UploadedFiles()
    signUpUploadedFilesDto: SignUpUploadedFilesDto,
  ): Promise<Vendor> {
    return this.authService.signUp(signUpDto, signUpUploadedFilesDto);
  }

  @AllowFor(UserType.VENDOR)
  @Serialize(VendorDto, 'Documents uploaded successfully.')
  @Post('upload-documents')
  uploadDocuments(
    @GetAuthedUser() authedUser: AuthedUser,
    @UploadedFiles()
    uploadedFiles?: any,
  ): Promise<Vendor> {
    return this.authService.uploadDocuments(authedUser.id, uploadedFiles);
  }

  @AllowFor(UserType.VENDOR)
  @Serialize(VendorDto, 'Account deleted successfully.')
  @Delete('delete-account')
  deleteAccount(@GetAuthedUser() authedUser: AuthedUser): Promise<Vendor> {
    return this.authService.deleteAccount(authedUser.id);
  }
}
