import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Injectable } from '@nestjs/common';
import { FindAllOnBoardingScreensDto } from '../dtos/find-all-on-boarding-screens.dto';
import { OnBoardingScreen } from '../entities/on-boarding-screen.entity';

@Injectable()
export class OnBoardingScreensService {
  constructor(
    @InjectRepository(OnBoardingScreen)
    private readonly onBoardingScreenRepository: Repository<OnBoardingScreen>,
  ) {}

  // find all.
  async findAll(
    findAllOnBoardingScreensDto: FindAllOnBoardingScreensDto,
    relations?: FindOptionsRelations<OnBoardingScreen>,
  ) {
    return this.onBoardingScreenRepository.find({
      where: {
        userType: findAllOnBoardingScreensDto.userType,
        active: true,
      },
      order: { index: 'asc' },
      relations,
    });
  }
}
