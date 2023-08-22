import { Controller, Get } from '@nestjs/common';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { UserType } from '../enums/user-type.enum';
import { ReasonDto } from '../dtos/reason.dto';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { ReasonsService } from '../services/reasons.service';

@AllowFor(UserType.CUSTOMER, UserType.VENDOR)
@Controller('reasons')
export class ReasonsController {
  constructor(private readonly reasonsService: ReasonsService) {}

  @Serialize(ReasonDto, 'All reasons.')
  @Get()
  findAll() {
    return this.reasonsService.findAll();
  }
}
