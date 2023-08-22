import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UploadedImageDto } from '../../shared/dtos/uploaded-image.dto';

export class SignUpUploadedFilesDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UploadedImageDto)
  avatar?: UploadedImageDto;
}
