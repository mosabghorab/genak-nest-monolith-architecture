import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '../../shared/entities/setting.entity';
import { CreateSettingDto } from '../dtos/create-setting.dto';
import { UpdateSettingDto } from '../dtos/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  // create.
  async create(createSettingDto: CreateSettingDto) {
    return this.settingRepository.save(
      await this.settingRepository.create(createSettingDto),
    );
  }

  // find all.
  findAll() {
    return this.settingRepository.find();
  }

  // find one by id.
  async findOneById(id: number) {
    const setting = await this.settingRepository.findOne({ where: { id } });
    if (!setting) {
      throw new BadRequestException('Setting not found.');
    }
    return setting;
  }

  // find one by key.
  async findOneByKey(key: string) {
    const setting = await this.settingRepository.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException('Setting not found.');
    }
    return setting;
  }

  // update.
  async update(id: number, updateSettingDto: UpdateSettingDto) {
    const setting = await this.findOneById(id);
    if (!setting) {
      throw new NotFoundException('Setting not found.');
    }
    Object.assign(setting, updateSettingDto);
    return this.settingRepository.save(setting);
  }

  // remove.
  async remove(id: number) {
    const setting = await this.findOneById(id);
    if (!setting) {
      throw new NotFoundException('Setting not found.');
    }
    return this.settingRepository.remove(setting);
  }
}
