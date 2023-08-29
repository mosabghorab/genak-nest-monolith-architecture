import { IsOptional, IsString } from 'class-validator';

export class FindAllSettingsDto {
  @IsOptional()
  @IsString()
  key?: string;
}
