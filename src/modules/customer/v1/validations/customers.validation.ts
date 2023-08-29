import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { SignUpDto } from '../dtos/sign-up.dto';
import { LocationsService } from '../../../shared/v1/services/locations.service';
import { CustomersService } from '../services/customers.service';
import { Customer } from '../../../shared/entities/customer.entity';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { Location } from '../../../shared/entities/location.entity';

@Injectable()
export class CustomersValidation {
  constructor(
    @Inject(forwardRef(() => CustomersService))
    private readonly customersService: CustomersService,
    private readonly locationsService: LocationsService,
  ) {}

  // validate creation.
  async validateCreation(signUpDto: SignUpDto): Promise<void> {
    const customerByPhone: Customer = await this.customersService.findOneByPhone(signUpDto.phone);
    if (customerByPhone) {
      throw new BadRequestException('Phone is already exists.');
    }
    const governorate: Location = await this.locationsService.findOneOrFailById(signUpDto.governorateId, 'Governorate not found.');
    const region: Location = await this.locationsService.findOneOrFailById(signUpDto.regionId, 'Region not found.');
    if (region.parentId !== governorate.id) {
      throw new BadRequestException('The provided region is not a child for the provided governorate.');
    }
  }

  // validate update.
  async validateUpdate(customerId: number, updateProfileDto: UpdateProfileDto): Promise<Customer> {
    const customer: Customer = await this.customersService.findOneOrFailById(customerId);
    if (updateProfileDto.phone) {
      const customerByPhone: Customer = await this.customersService.findOneByPhone(updateProfileDto.phone);
      if (customerByPhone) {
        throw new BadRequestException('Phone is already exists.');
      }
    }
    if (updateProfileDto.governorateId) {
      const governorate: Location = await this.locationsService.findOneOrFailById(updateProfileDto.governorateId, 'Governorate not found.');
      const region: Location = await this.locationsService.findOneOrFailById(updateProfileDto.regionId, 'Region not found.');
      if (region.parentId !== governorate.id) {
        throw new BadRequestException('The provided region is not a child for the provided governorate.');
      }
    }
    return customer;
  }
}
