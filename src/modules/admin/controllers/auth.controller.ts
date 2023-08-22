import { Body, Controller, Post } from '@nestjs/common';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { Public } from '../../../core/metadata/public.metadata';
import { SignInWithEmailAndPasswordDto } from '../dtos/sign-in-with-email-and-password.dto';
import { AuthService } from '../services/auth.service';
import { AdminDto } from '../dtos/admin.dto';

@Public()
@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Serialize(AdminDto, 'You signed in successfully')
  @Post('sign-in-with-email-and-password')
  async signInWithEmailAndPassword(
    @Body() signInWithEmailAndPasswordDto: SignInWithEmailAndPasswordDto,
  ) {
    return this.authService.signInWithEmailAndPassword(
      signInWithEmailAndPasswordDto,
    );
  }
}
