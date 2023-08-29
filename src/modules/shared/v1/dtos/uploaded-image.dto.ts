import { IsEnum, IsNumber, IsObject, IsString, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ImageExtension } from '../../enums/image-extension.enum';
import { promisify } from 'util';
import { Helpers } from '../../../../core/helpers/helpers';

export class UploadedImageDto {
  @IsString()
  @Transform(({ value }) => Helpers.generateUniqueFileName(value))
  name: string;

  @IsObject()
  data: any;

  @Max(10 * 1024 * 1024) // 10 mb
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  size: number;

  @IsEnum(ImageExtension)
  mimetype: ImageExtension;

  @IsObject()
  @Transform(({ value }) => promisify(value))
  mv: any;
}
