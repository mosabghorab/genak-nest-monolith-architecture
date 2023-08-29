import { IsString } from 'class-validator';

export class CreateSettingDto {
  @IsString()
  name: string;

  @IsString()
  key: string;

  @IsString()
  value: string;

  @IsString()
  group: string;
}
