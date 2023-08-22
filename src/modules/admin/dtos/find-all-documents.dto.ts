import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ServiceType } from '../../shared/enums/service-type.enum';
import { Transform } from 'class-transformer';

export class FindAllDocumentsDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    else if (value === 'false') return false;
    else return null;
  })
  active?: boolean;
}
