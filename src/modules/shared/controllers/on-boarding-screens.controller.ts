import { Controller, Get, Query } from '@nestjs/common';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { OnBoardingScreensService } from '../services/on-boarding-screens.service';
import { FindAllOnBoardingScreensDto } from '../dtos/find-all-on-boarding-screens.dto';
import { Public } from '../../../core/metadata/public.metadata';
import { OnBoardingScreenDto } from '../dtos/on-boarding-screen.dto';

@Public()
@Controller('on-boarding-screens')
export class OnBoardingScreensController {
  constructor(
    private readonly onBoardingScreensService: OnBoardingScreensService,
  ) {}

  @Serialize(OnBoardingScreenDto, 'All on boarding screens.')
  @Get()
  findAll(@Query() findAllOnBoardingScreensDto: FindAllOnBoardingScreensDto) {
    return this.onBoardingScreensService.findAll(findAllOnBoardingScreensDto);
  }
}
