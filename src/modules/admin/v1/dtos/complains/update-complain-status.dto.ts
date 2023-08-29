import { IsEnum } from 'class-validator';
import { ComplainStatus } from '../../../../shared/enums/complain-status.enum';

export class UpdateComplainStatusDto {
  @IsEnum(ComplainStatus)
  status: ComplainStatus;
}
