import { Controller, Get, Query } from '@nestjs/common';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { UserType } from '../../../shared/enums/user-type.enum';
import { VendorsService } from '../services/vendors.service';
import { FindAllVendorsDto } from '../dtos/find-all-vendors.dto';
import { VendorDto } from '../../../shared/v1/dtos/vendor.dto';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { Vendor } from '../../../shared/entities/vendor.entity';

@AllowFor(UserType.CUSTOMER)
@Controller({ path: 'customer/vendors', version: '1' })
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Serialize(VendorDto, 'All vendors.')
  @Get()
  findAll(@Query() findAllVendorsDto: FindAllVendorsDto): Promise<Vendor[]> {
    return this.vendorsService.findAll(findAllVendorsDto);
  }
}
