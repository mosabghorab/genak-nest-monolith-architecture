import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OnBoardingScreen } from '../../shared/entities/on-boarding-screen.entity';
import { CreateOnBoardingScreenDto } from '../dtos/create-on-boarding-screen.dto';
import { UpdateOnBoardingScreenDto } from '../dtos/update-on-boarding-screen.dto';
import { CreateOnBoardingScreenUploadedFilesDto } from '../dtos/create-on-boarding-screen-uploaded-files.dto';
import { Helpers } from '../../../core/helpers';
import { Constants } from '../../../core/constants';
import { UpdateOnBoardingScreenUploadedFilesDto } from '../dtos/update-on-boarding-screen-uploaded-files.dto';
import { unlinkSync } from 'fs';
import { FindAllOnBoardingScreensDto } from '../dtos/find-all-on-boarding-screens.dto';

@Injectable()
export class OnBoardingScreensService {
  constructor(
    @InjectRepository(OnBoardingScreen)
    private readonly onBoardingScreenRepository: Repository<OnBoardingScreen>,
  ) {}

  // find one by id.
  async findOneById(
    id: number,
    relations?: FindOptionsRelations<OnBoardingScreen>,
  ) {
    return this.onBoardingScreenRepository.findOne({
      where: { id },
      relations,
    });
  }

  // find all.
  async findAll(
    findAllOnBoardingScreensDto: FindAllOnBoardingScreensDto,
    relations?: FindOptionsRelations<OnBoardingScreen>,
  ) {
    return this.onBoardingScreenRepository.find({
      where: {
        userType: findAllOnBoardingScreensDto.userType,
      },
      order: { index: 'asc' },
      relations,
    });
  }

  // create.
  async create(
    createOnBoardingScreenDto: CreateOnBoardingScreenDto,
    createOnBoardingScreenUploadedFilesDto: CreateOnBoardingScreenUploadedFilesDto,
  ) {
    await Helpers.saveFile(
      Constants.onBoardingScreensImagesPath,
      createOnBoardingScreenUploadedFilesDto.image.name,
      createOnBoardingScreenUploadedFilesDto.image,
    );
    return this.onBoardingScreenRepository.save(
      await this.onBoardingScreenRepository.create({
        image: createOnBoardingScreenUploadedFilesDto.image.name,
        ...createOnBoardingScreenDto,
      }),
    );
  }

  // update.
  async update(
    id: number,
    updateOnBoardingScreenDto: UpdateOnBoardingScreenDto,
    updateOnBoardingScreenUploadedFilesDto: UpdateOnBoardingScreenUploadedFilesDto,
  ) {
    const onBoardingScreen = await this.findOneById(id);
    if (!onBoardingScreen) {
      throw new NotFoundException('On boarding screen not found.');
    }
    if (updateOnBoardingScreenUploadedFilesDto.image) {
      unlinkSync(
        Constants.onBoardingScreensImagesPath + onBoardingScreen.image,
      );
      await Helpers.saveFile(
        Constants.onBoardingScreensImagesPath,
        updateOnBoardingScreenUploadedFilesDto.image.name,
        updateOnBoardingScreenUploadedFilesDto.image,
      );
      onBoardingScreen.image =
        updateOnBoardingScreenUploadedFilesDto.image.name;
    }
    Object.assign(onBoardingScreen, updateOnBoardingScreenDto);
    return this.onBoardingScreenRepository.save(onBoardingScreen);
  }

  // remove.
  async remove(id: number) {
    const onBoardingScreen = await this.findOneById(id);
    if (!onBoardingScreen) {
      throw new NotFoundException('On boarding screen not found.');
    }
    return this.onBoardingScreenRepository.remove(onBoardingScreen);
  }
}
