import { IsEnum } from 'class-validator';
import { ClientUserType } from '../../enums/client-user-type.enum';

export class FindAllOnBoardingScreensDto {
  @IsEnum(ClientUserType)
  userType: ClientUserType;
}
