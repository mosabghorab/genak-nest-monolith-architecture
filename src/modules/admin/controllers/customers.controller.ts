import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { UserType } from '../../shared/enums/user-type.enum';
import { CustomersService } from '../services/customers.service';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { CustomerDto } from '../../shared/dtos/customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { PermissionsGroups } from '../enums/permissions-groups.enum';
import { PermissionsActions } from '../enums/permissions-actions.enum';
import { PermissionsTarget } from '../../../core/metadata/permissions-target.metadata';
import { AdminMustCanDo } from '../../../core/metadata/admin-must-can-do.metadata';
import { CustomersPaginationDto } from '../dtos/customers-pagination.dto';
import { FindAllCustomersDto } from '../dtos/find-all-customers.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionsGroups.CUSTOMERS)
@Controller('admin/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @AdminMustCanDo(PermissionsActions.CREATE)
  @Serialize(CustomerDto, 'Customer created successfully.')
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(CustomersPaginationDto, 'All customers.')
  @Get()
  findAll(@Query() findAllCustomersDto: FindAllCustomersDto) {
    return this.customersService.findAll(findAllCustomersDto, {
      governorate: true,
      region: true,
      orders: true,
    });
  }

  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(CustomerDto, 'One customer.')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const customer = await this.customersService.findOneById(id, {
      governorate: true,
      region: true,
    });
    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }
    return customer;
  }

  @AdminMustCanDo(PermissionsActions.UPDATE)
  @Serialize(CustomerDto, 'Customer updated successfully.')
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @AdminMustCanDo(PermissionsActions.DELETE)
  @Serialize(CustomerDto, 'Customer deleted successfully.')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.customersService.remove(id);
  }
}
