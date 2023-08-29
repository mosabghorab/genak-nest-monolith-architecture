import { IsEmail, IsString } from 'class-validator';

export class SignInWithEmailAndPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
