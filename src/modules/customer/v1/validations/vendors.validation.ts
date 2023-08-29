import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { LocationsService } from '../../../shared/v1/services/locations.service';
import { FindAllVendorsDto } from '../dtos/find-all-vendors.dto';
import { VendorsService } from '../services/vendors.service';
import { Location } from '../../../shared/entities/location.entity';

@Injectable()
export class VendorsValidation {
  constructor(
    @Inject(forwardRef(() => VendorsService))
    private readonly vendorsService: VendorsService,
    private readonly locationsService: LocationsService,
  ) {}

  // validate find all.
  async validateFindAll(findAllVendorsDto: FindAllVendorsDto): Promise<void> {
    if (findAllVendorsDto.governorateId) {
      const governorate: Location = await this.locationsService.findOneOrFailById(findAllVendorsDto.governorateId, 'Governorate not found.');
      for (const regionId of findAllVendorsDto.regionsIds) {
        const region: Location = await this.locationsService.findOneOrFailById(regionId, 'Region not found.');
        if (region.parentId !== governorate.id) {
          throw new BadRequestException('The provided region is not a child for the provided governorate.');
        }
      }
    }
  }
}
