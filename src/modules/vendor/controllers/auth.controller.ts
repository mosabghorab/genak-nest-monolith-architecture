import { Body, Controller, Delete, Post, UploadedFiles } from '@nestjs/common';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { AuthService } from '../services/auth.service';
import { CheckPhoneDto } from '../../shared/dtos/check-phone.dto';
import { SignInWithPhoneDto } from '../../shared/dtos/sign-in-with-phone.dto';
import { Public } from '../../../core/metadata/public.metadata';
import { VendorDto } from '../../shared/dtos/vendor.dto';
import { SignUpDto } from '../dtos/sign-up.dto';
import { SignUpUploadedFilesDto } from '../dtos/sign-up-uploaded-files.dto';
import { UserType } from '../../shared/enums/user-type.enum';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { GetAuthedUser } from '../../../core/custom-decorators/get-authed-user.decorator';
import { AuthedUser } from '../../../core/types/authed-user.type';

@Controller('vendor/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Serialize(VendorDto, 'Phone is exist.')
  @Post('check-phone')
  async checkPhone(@Body() checkPhoneDto: CheckPhoneDto) {
    return this.authService.checkPhone(checkPhoneDto);
  }

  @Public()
  @Serialize(VendorDto, 'You signed in successfully.')
  @Post('sign-in-with-phone')
  async signInWithPhone(@Body() signInWithPhoneDto: SignInWithPhoneDto) {
    return this.authService.signInWithPhone(signInWithPhoneDto);
  }

  @Public()
  @Serialize(VendorDto, 'You signed up successfully.')
  @Post('sign-up')
  async signUp(
    @Body() signUpDto: SignUpDto,
    @UploadedFiles()
    signUpUploadedFilesDto: SignUpUploadedFilesDto,
  ) {
    return this.authService.signUp(signUpDto, signUpUploadedFilesDto);
  }

  @AllowFor(UserType.VENDOR)
  @Serialize(VendorDto, 'Documents uploaded successfully.')
  @Post('upload-documents')
  async uploadDocuments(
    @GetAuthedUser() authedUser: AuthedUser,
    @UploadedFiles()
    uploadedFiles?: any,
  ) {
    return this.authService.uploadDocuments(authedUser.id, uploadedFiles);
  }

  @AllowFor(UserType.VENDOR)
  @Serialize(VendorDto, 'Account deleted successfully.')
  @Delete('delete-account')
  async deleteAccount(@GetAuthedUser() authedUser: AuthedUser) {
    return this.authService.deleteAccount(authedUser.id);
  }
}
