import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { AdminsService } from './admins.service';

@Injectable()
export class ProfileService {
  constructor(private readonly adminsService: AdminsService) {}

  // update.
  async update(adminId: number, updateProfileDto: UpdateProfileDto) {
    return this.adminsService.updateProfile(adminId, updateProfileDto);
  }
}
