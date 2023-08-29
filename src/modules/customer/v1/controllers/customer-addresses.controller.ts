import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { UserType } from '../../../shared/enums/user-type.enum';
import { CustomerAddressesService } from '../services/customer-addresses.service';
import { CustomerAddressDto } from '../dtos/customer-address.dto';
import { CreateCustomerAddressDto } from '../dtos/create-customer-address.dto';
import { UpdateCustomerAddressDto } from '../dtos/update-customer-address.dto';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { AuthedUser } from '../../../../core/types/authed-user.type';
import { GetAuthedUser } from '../../../../core/custom-decorators/get-authed-user.decorator';
import { CustomerAddress } from '../../entities/customer-address.entity';

@AllowFor(UserType.CUSTOMER)
@Controller({ path: 'customer/addresses', version: '1' })
export class CustomerAddressesController {
  constructor(private readonly customerAddressesService: CustomerAddressesService) {}

  @Serialize(CustomerAddressDto, 'Address created successfully.')
  @Post()
  create(@GetAuthedUser() authedUser: AuthedUser, @Body() createCustomersAddressDto: CreateCustomerAddressDto): Promise<CustomerAddress> {
    return this.customerAddressesService.create(authedUser.id, createCustomersAddressDto);
  }

  @Serialize(CustomerAddressDto, 'All addresses.')
  @Get()
  findAll(@GetAuthedUser() authedUser: AuthedUser): Promise<CustomerAddress[]> {
    return this.customerAddressesService.findAll(authedUser.id);
  }

  @Serialize(CustomerAddressDto, 'Address updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCustomersAddressDto: UpdateCustomerAddressDto): Promise<CustomerAddress> {
    return this.customerAddressesService.update(id, updateCustomersAddressDto);
  }

  @Serialize(CustomerAddressDto, 'Address removed successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<CustomerAddress> {
    return this.customerAddressesService.remove(id);
  }
}
