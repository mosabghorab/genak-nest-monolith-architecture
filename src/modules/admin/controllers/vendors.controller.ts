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
  UploadedFiles,
} from '@nestjs/common';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { UserType } from '../../shared/enums/user-type.enum';
import { PermissionsTarget } from '../../../core/metadata/permissions-target.metadata';
import { PermissionsGroups } from '../enums/permissions-groups.enum';
import { AdminMustCanDo } from '../../../core/metadata/admin-must-can-do.metadata';
import { PermissionsActions } from '../enums/permissions-actions.enum';
import { VendorsService } from '../services/vendors.service';
import { CreateVendorDto } from '../dtos/create-vendor.dto';
import { VendorDto } from '../../shared/dtos/vendor.dto';
import { FindAllVendorsDto } from '../dtos/find-all-vendors.dto';
import { UpdateVendorDto } from '../dtos/update-vendor.dto';
import { VendorsPaginationDto } from '../dtos/vendors-pagination.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionsGroups.VENDORS)
@Controller('admin/vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @AdminMustCanDo(PermissionsActions.CREATE)
  @Serialize(VendorDto, 'Vendor created successfully.')
  @Post()
  async create(
    @Body() createVendorDto: CreateVendorDto,
    @UploadedFiles()
    uploadedFiles?: any,
  ) {
    return this.vendorsService.create(createVendorDto, uploadedFiles);
  }

  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(VendorsPaginationDto, 'All vendors.')
  @Get()
  findAll(@Query() findAllVendorsDto: FindAllVendorsDto) {
    return this.vendorsService.findAll(findAllVendorsDto, {
      governorate: true,
      locationsVendors: { location: true },
      orders: true,
    });
  }

  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(VendorDto, 'One vendor.')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const vendor = await this.vendorsService.findOneById(id, {
      governorate: true,
      locationsVendors: { location: true },
      attachments: { document: true },
    });
    if (!vendor) {
      throw new NotFoundException('Vendor not found.');
    }
    return vendor;
  }

  @AdminMustCanDo(PermissionsActions.UPDATE)
  @Serialize(VendorDto, 'Vendor updated successfully.')
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateVendorDto: UpdateVendorDto,
    @UploadedFiles()
    uploadedFiles?: any,
  ) {
    return this.vendorsService.update(id, updateVendorDto, uploadedFiles);
  }

  @AdminMustCanDo(PermissionsActions.DELETE)
  @Serialize(VendorDto, 'Vendor deleted successfully.')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.vendorsService.remove(id);
  }
}
