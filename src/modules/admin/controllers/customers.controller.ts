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
import { PermissionGroup } from '../enums/permission-group.enum';
import { PermissionAction } from '../enums/permission-action.enum';
import { PermissionsTarget } from '../../../core/metadata/permissions-target.metadata';
import { AdminMustCanDo } from '../../../core/metadata/admin-must-can-do.metadata';
import { CustomersPaginationDto } from '../dtos/customers-pagination.dto';
import { FindAllCustomersDto } from '../dtos/find-all-customers.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.CUSTOMERS)
@Controller('admin/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(CustomerDto, 'Customer created successfully.')
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(CustomersPaginationDto, 'All customers.')
  @Get()
  findAll(@Query() findAllCustomersDto: FindAllCustomersDto) {
    return this.customersService.findAll(findAllCustomersDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
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

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(CustomerDto, 'Customer updated successfully.')
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(CustomerDto, 'Customer deleted successfully.')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.customersService.remove(id);
  }
}
