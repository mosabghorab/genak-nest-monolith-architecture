import { IsEnum, IsNumber, IsObject, IsString, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { Helpers } from '../../../../core/helpers';
import { promisify } from 'util';
import { FileExtension } from '../../enums/file-extension.enum';

export class UploadedFileDto {
  @IsString()
  @Transform(({ value }) => Helpers.generateUniqueFileName(value))
  name: string;

  @IsObject()
  data: any;

  @Max(10 * 1024 * 1024) // 10 mb
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  size: number;

  @IsEnum(FileExtension)
  mimetype: FileExtension;

  @IsObject()
  @Transform(({ value }) => promisify(value))
  mv: any;
}
