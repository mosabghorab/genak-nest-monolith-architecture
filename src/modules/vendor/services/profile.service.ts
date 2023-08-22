import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { VendorsService } from './vendors.service';
import { UpdateProfileUploadedFilesDto } from '../dtos/update-profile-uploaded-files.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly vendorsService: VendorsService) {}

  // update.
  async update(
    vendorId: number,
    updateProfileDto: UpdateProfileDto,
    updateProfileUploadedFilesDto: UpdateProfileUploadedFilesDto,
  ) {
    return this.vendorsService.update(
      vendorId,
      updateProfileDto,
      updateProfileUploadedFilesDto,
    );
  }
}
