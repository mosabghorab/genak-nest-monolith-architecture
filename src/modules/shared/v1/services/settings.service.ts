import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '../../entities/setting.entity';
import { FindAllSettingsDto } from '../dtos/find-all-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  // find all.
  findAll(findAllSettingsDto: FindAllSettingsDto): Promise<Setting[]> {
    return this.settingRepository.find({
      where: { key: findAllSettingsDto.key },
    });
  }
}
