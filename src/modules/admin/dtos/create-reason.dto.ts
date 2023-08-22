import { IsString } from 'class-validator';

export class CreateReasonDto {
  @IsString()
  name: string;
}
