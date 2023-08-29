import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles } from '@nestjs/common';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { UserType } from '../../../shared/enums/user-type.enum';
import { PermissionsTarget } from '../../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../../enums/permission-group.enum';
import { AdminMustCanDo } from '../../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../../enums/permission-action.enum';
import { VendorsService } from '../services/vendors.service';
import { CreateVendorDto } from '../dtos/vendors/create-vendor.dto';
import { VendorDto } from '../../../shared/v1/dtos/vendor.dto';
import { FindAllVendorsDto } from '../dtos/vendors/find-all-vendors.dto';
import { UpdateVendorDto } from '../dtos/vendors/update-vendor.dto';
import { VendorsPaginationDto } from '../dtos/vendors/vendors-pagination.dto';
import { Vendor } from '../../../shared/entities/vendor.entity';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.VENDORS)
@Controller({ path: 'admin/vendors', version: '1' })
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(VendorDto, 'Vendor created successfully.')
  @Post()
  create(
    @Body() createVendorDto: CreateVendorDto,
    @UploadedFiles()
    uploadedFiles?: any,
  ): Promise<Vendor> {
    return this.vendorsService.create(createVendorDto, uploadedFiles);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(VendorsPaginationDto, 'All vendors.')
  @Get()
  findAll(@Query() findAllVendorsDto: FindAllVendorsDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Vendor[];
    currentPage: number;
  }> {
    return this.vendorsService.findAll(findAllVendorsDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(VendorDto, 'One vendor.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Vendor> {
    return this.vendorsService.findOneOrFailById(id, null, {
      governorate: true,
      locationsVendors: { location: true },
      attachments: { document: true },
    });
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(VendorDto, 'Vendor updated successfully.')
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateVendorDto: UpdateVendorDto,
    @UploadedFiles()
    uploadedFiles?: any,
  ): Promise<Vendor> {
    return this.vendorsService.update(id, updateVendorDto, uploadedFiles);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(VendorDto, 'Vendor deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Vendor> {
    return this.vendorsService.remove(id);
  }
}
