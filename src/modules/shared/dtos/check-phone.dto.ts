import { Matches } from 'class-validator';
import { Constants } from '../../../core/constants';

export class CheckPhoneDto {
  @Matches(Constants.phoneValidationRegx, {
    message: 'Invalid phone format.',
  })
  phone: string;
}
