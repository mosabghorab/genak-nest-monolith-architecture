import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { DocumentType } from '../../../../shared/enums/document-type.enum';
import { ServiceType } from '../../../../shared/enums/service-type.enum';
import { Transform } from 'class-transformer';

export class CreateDocumentDto {
  @IsString()
  name: string;

  @IsEnum(DocumentType)
  type: DocumentType;

  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  required: boolean;
}
