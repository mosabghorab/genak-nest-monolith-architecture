import { Injectable } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { Customer } from '../../../shared/entities/customer.entity';

@Injectable()
export class ProfileService {
  constructor(private readonly customersService: CustomersService) {}

  // update.
  update(customerId: number, updateProfileDto: UpdateProfileDto): Promise<Customer> {
    return this.customersService.update(customerId, updateProfileDto);
  }
}
