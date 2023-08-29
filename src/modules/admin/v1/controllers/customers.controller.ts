import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { UserType } from '../../../shared/enums/user-type.enum';
import { CustomersService } from '../services/customers.service';
import { CreateCustomerDto } from '../dtos/customers/create-customer.dto';
import { CustomerDto } from '../../../shared/v1/dtos/customer.dto';
import { UpdateCustomerDto } from '../dtos/customers/update-customer.dto';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { PermissionGroup } from '../../enums/permission-group.enum';
import { PermissionAction } from '../../enums/permission-action.enum';
import { PermissionsTarget } from '../../../../core/metadata/permissions-target.metadata';
import { AdminMustCanDo } from '../../../../core/metadata/admin-must-can-do.metadata';
import { CustomersPaginationDto } from '../dtos/customers/customers-pagination.dto';
import { FindAllCustomersDto } from '../dtos/customers/find-all-customers.dto';
import { Customer } from '../../../shared/entities/customer.entity';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.CUSTOMERS)
@Controller({ path: 'admin/customers', version: '1' })
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(CustomerDto, 'Customer created successfully.')
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customersService.create(createCustomerDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(CustomersPaginationDto, 'All customers.')
  @Get()
  findAll(@Query() findAllCustomersDto: FindAllCustomersDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Customer[];
    currentPage: number;
  }> {
    return this.customersService.findAll(findAllCustomersDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(CustomerDto, 'One customer.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Customer> {
    return this.customersService.findOneOrFailById(id, null, {
      governorate: true,
      region: true,
    });
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(CustomerDto, 'Customer updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    return this.customersService.update(id, updateCustomerDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(CustomerDto, 'Customer deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Customer> {
    return this.customersService.remove(id);
  }
}
