import { IsArray, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsArray()
  @Transform(({ value }) => JSON.parse(value))
  permissionsIds: number[];
}
