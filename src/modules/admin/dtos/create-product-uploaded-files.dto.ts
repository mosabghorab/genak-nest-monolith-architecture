import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UploadedImageDto } from '../../shared/dtos/uploaded-image.dto';

export class CreateProductUploadedFilesDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UploadedImageDto)
  image: UploadedImageDto;
}
