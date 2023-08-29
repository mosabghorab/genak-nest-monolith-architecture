import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UploadedImageDto } from '../../../shared/v1/dtos/uploaded-image.dto';

export class UpdateProfileUploadedFilesDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UploadedImageDto)
  avatar?: UploadedImageDto;
}
