import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OnBoardingScreen } from '../../../shared/entities/on-boarding-screen.entity';
import { CreateOnBoardingScreenDto } from '../dtos/on-boarding-screens/create-on-boarding-screen.dto';
import { UpdateOnBoardingScreenDto } from '../dtos/on-boarding-screens/update-on-boarding-screen.dto';
import { CreateOnBoardingScreenUploadedFilesDto } from '../dtos/on-boarding-screens/create-on-boarding-screen-uploaded-files.dto';
import { Helpers } from '../../../../core/helpers';
import { Constants } from '../../../../core/constants';
import { UpdateOnBoardingScreenUploadedFilesDto } from '../dtos/on-boarding-screens/update-on-boarding-screen-uploaded-files.dto';
import { unlinkSync } from 'fs';
import { FindAllOnBoardingScreensDto } from '../dtos/on-boarding-screens/find-all-on-boarding-screens.dto';
import { OrderByType } from '../../../shared/enums/order-by-type.enum';

@Injectable()
export class OnBoardingScreensService {
  constructor(
    @InjectRepository(OnBoardingScreen)
    private readonly onBoardingScreenRepository: Repository<OnBoardingScreen>,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<OnBoardingScreen>): Promise<OnBoardingScreen | null> {
    return this.onBoardingScreenRepository.findOne({
      where: { id },
      relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, failureMessage?: string, relations?: FindOptionsRelations<OnBoardingScreen>): Promise<OnBoardingScreen> {
    const onBoardingScreen: OnBoardingScreen = await this.findOneById(id, relations);
    if (!onBoardingScreen) {
      throw new NotFoundException(failureMessage || 'On boarding screen not found.');
    }
    return onBoardingScreen;
  }

  // find all.
  findAll(findAllOnBoardingScreensDto: FindAllOnBoardingScreensDto): Promise<OnBoardingScreen[]> {
    return this.onBoardingScreenRepository.find({
      where: {
        userType: findAllOnBoardingScreensDto.userType,
      },
      order: { index: OrderByType.ASC },
    });
  }

  // create.
  async create(createOnBoardingScreenDto: CreateOnBoardingScreenDto, createOnBoardingScreenUploadedFilesDto: CreateOnBoardingScreenUploadedFilesDto): Promise<OnBoardingScreen> {
    await Helpers.saveFile(Constants.onBoardingScreensImagesPath, createOnBoardingScreenUploadedFilesDto.image.name, createOnBoardingScreenUploadedFilesDto.image);
    return this.onBoardingScreenRepository.save(
      await this.onBoardingScreenRepository.create({
        image: createOnBoardingScreenUploadedFilesDto.image.name,
        ...createOnBoardingScreenDto,
      }),
    );
  }

  // update.
  async update(id: number, updateOnBoardingScreenDto: UpdateOnBoardingScreenDto, updateOnBoardingScreenUploadedFilesDto: UpdateOnBoardingScreenUploadedFilesDto): Promise<OnBoardingScreen> {
    const onBoardingScreen: OnBoardingScreen = await this.findOneOrFailById(id);
    if (updateOnBoardingScreenUploadedFilesDto.image) {
      unlinkSync(Constants.onBoardingScreensImagesPath + onBoardingScreen.image);
      await Helpers.saveFile(Constants.onBoardingScreensImagesPath, updateOnBoardingScreenUploadedFilesDto.image.name, updateOnBoardingScreenUploadedFilesDto.image);
      onBoardingScreen.image = updateOnBoardingScreenUploadedFilesDto.image.name;
    }
    Object.assign(onBoardingScreen, updateOnBoardingScreenDto);
    return this.onBoardingScreenRepository.save(onBoardingScreen);
  }

  // remove.
  async remove(id: number): Promise<OnBoardingScreen> {
    const onBoardingScreen: OnBoardingScreen = await this.findOneOrFailById(id);
    return this.onBoardingScreenRepository.remove(onBoardingScreen);
  }
}
