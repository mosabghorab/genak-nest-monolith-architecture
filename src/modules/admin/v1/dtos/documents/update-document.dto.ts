import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { DocumentType } from '../../../../shared/enums/document-type.enum';
import { Transform } from 'class-transformer';

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  required?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  active?: boolean;
}
