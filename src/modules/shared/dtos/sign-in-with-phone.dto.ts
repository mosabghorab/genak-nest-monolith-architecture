import { IsString, Matches } from 'class-validator';
import { Constants } from '../../../core/constants';

export class SignInWithPhoneDto {
  @Matches(Constants.phoneValidationRegx, {
    message: 'Invalid phone format.',
  })
  phone: string;

  @IsString()
  code: string;
}
