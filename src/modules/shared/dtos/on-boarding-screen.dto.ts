import { Expose } from 'class-transformer';
import { ClientUserType } from '../enums/client-user-type.enum';

export class OnBoardingScreenDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  index: number;

  @Expose()
  image: string;

  @Expose()
  userType: ClientUserType;

  @Expose()
  active: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
