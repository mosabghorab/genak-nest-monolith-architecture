import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { VendorsService } from './vendors.service';
import { UpdateProfileUploadedFilesDto } from '../dtos/update-profile-uploaded-files.dto';
import { Vendor } from '../../../shared/entities/vendor.entity';

@Injectable()
export class ProfileService {
  constructor(private readonly vendorsService: VendorsService) {}

  // update.
  update(vendorId: number, updateProfileDto: UpdateProfileDto, updateProfileUploadedFilesDto: UpdateProfileUploadedFilesDto): Promise<Vendor> {
    return this.vendorsService.update(vendorId, updateProfileDto, updateProfileUploadedFilesDto);
  }
}
