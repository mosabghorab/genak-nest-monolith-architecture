import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CustomersService } from '../services/customers.service';
import { Customer } from '../../../shared/entities/customer.entity';
import { Location } from '../../../shared/entities/location.entity';
import { CreateCustomerDto } from '../dtos/customers/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/customers/update-customer.dto';
import { LocationsService } from '../services/locations.service';

@Injectable()
export class CustomersValidation {
  constructor(
    @Inject(forwardRef(() => CustomersService))
    private readonly customersService: CustomersService,
    private readonly locationsService: LocationsService,
  ) {}

  // validate creation.
  async validateCreation(createCustomerDto: CreateCustomerDto): Promise<void> {
    const customerByPhone: Customer = await this.customersService.findOneByPhone(createCustomerDto.phone);
    if (customerByPhone) {
      throw new BadRequestException('Phone is already exists.');
    }
    const governorate: Location = await this.locationsService.findOneOrFailById(createCustomerDto.governorateId, 'Governorate not found.');
    const region: Location = await this.locationsService.findOneOrFailById(createCustomerDto.regionId, 'Region not found.');
    if (region.parentId !== governorate.id) {
      throw new BadRequestException('The provided region is not a child for the provided governorate.');
    }
  }

  // validate update.
  async validateUpdate(customerId: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer: Customer = await this.customersService.findOneOrFailById(customerId);
    if (updateCustomerDto.phone) {
      const customerByPhone: Customer = await this.customersService.findOneByPhone(updateCustomerDto.phone);
      if (customerByPhone) {
        throw new BadRequestException('Phone is already exists.');
      }
    }
    if (updateCustomerDto.governorateId) {
      const governorate: Location = await this.locationsService.findOneOrFailById(updateCustomerDto.governorateId, 'Governorate not found.');
      const region: Location = await this.locationsService.findOneOrFailById(updateCustomerDto.regionId, 'Region not found.');
      if (region.parentId !== governorate.id) {
        throw new BadRequestException('The provided region is not a child for the provided governorate.');
      }
    }
    return customer;
  }
}
