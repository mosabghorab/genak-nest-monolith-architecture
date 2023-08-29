import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FindAllOnBoardingScreensDto } from '../dtos/find-all-on-boarding-screens.dto';
import { OnBoardingScreen } from '../../entities/on-boarding-screen.entity';
import { OrderByType } from '../../enums/order-by-type.enum';

@Injectable()
export class OnBoardingScreensService {
  constructor(
    @InjectRepository(OnBoardingScreen)
    private readonly onBoardingScreenRepository: Repository<OnBoardingScreen>,
  ) {}

  // find all.
  findAll(findAllOnBoardingScreensDto: FindAllOnBoardingScreensDto): Promise<OnBoardingScreen[]> {
    return this.onBoardingScreenRepository.find({
      where: {
        userType: findAllOnBoardingScreensDto.userType,
        active: true,
      },
      order: { index: OrderByType.ASC },
    });
  }
}
