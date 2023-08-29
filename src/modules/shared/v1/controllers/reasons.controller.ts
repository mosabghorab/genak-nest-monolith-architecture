import { Controller, Get } from '@nestjs/common';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { UserType } from '../../enums/user-type.enum';
import { ReasonDto } from '../dtos/reason.dto';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { ReasonsService } from '../services/reasons.service';
import { Reason } from '../../entities/reason.entity';

@AllowFor(UserType.CUSTOMER, UserType.VENDOR)
@Controller({ path: 'reasons', version: '1' })
export class ReasonsController {
  constructor(private readonly reasonsService: ReasonsService) {}

  @Serialize(ReasonDto, 'All reasons.')
  @Get()
  findAll(): Promise<Reason[]> {
    return this.reasonsService.findAll();
  }
}
