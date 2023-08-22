import { Injectable } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly customersService: CustomersService) {}

  // update.
  async update(customerId: number, updateProfileDto: UpdateProfileDto) {
    return this.customersService.update(customerId, updateProfileDto);
  }
}
