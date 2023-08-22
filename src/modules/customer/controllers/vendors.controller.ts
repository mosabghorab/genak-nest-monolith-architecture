import { Controller, Get, Query } from '@nestjs/common';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { UserType } from '../../shared/enums/user-type.enum';
import { VendorsService } from '../services/vendors.service';
import { FindAllVendorsDto } from '../dtos/find-all-vendors.dto';
import { VendorDto } from '../../shared/dtos/vendor.dto';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';

@AllowFor(UserType.CUSTOMER)
@Controller('customer/vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Serialize(VendorDto, 'All vendors.')
  @Get()
  findAll(@Query() findAllVendorsDto: FindAllVendorsDto) {
    return this.vendorsService.findAll(findAllVendorsDto, {
      governorate: true,
    });
  }
}
