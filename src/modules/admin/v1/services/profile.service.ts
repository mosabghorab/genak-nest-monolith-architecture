import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from '../dtos/profile/update-profile.dto';
import { AdminsService } from './admins.service';
import { Admin } from '../../entities/admin.entity';

@Injectable()
export class ProfileService {
  constructor(private readonly adminsService: AdminsService) {}

  // update.
  update(adminId: number, updateProfileDto: UpdateProfileDto): Promise<Admin> {
    return this.adminsService.updateProfile(adminId, updateProfileDto);
  }
}
