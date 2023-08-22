import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Reason } from '../../shared/entities/reason.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReasonDto } from '../dtos/create-reason.dto';
import { UpdateReasonDto } from '../dtos/update-reason.dto';

@Injectable()
export class ReasonsService {
  constructor(
    @InjectRepository(Reason)
    private readonly reasonRepository: Repository<Reason>,
  ) {}

  // find one by id.
  async findOneById(id: number, relations?: FindOptionsRelations<Reason>) {
    return this.reasonRepository.findOne({
      where: { id },
      relations,
    });
  }

  // find all.
  async findAll(relations?: FindOptionsRelations<Reason>) {
    return this.reasonRepository.find({
      relations,
    });
  }

  // create.
  async create(createReasonDto: CreateReasonDto) {
    return this.reasonRepository.save(
      await this.reasonRepository.create(createReasonDto),
    );
  }

  // update.
  async update(id: number, updateReasonDto: UpdateReasonDto) {
    const reason = await this.findOneById(id);
    if (!reason) {
      throw new NotFoundException('Reason not found.');
    }
    Object.assign(reason, updateReasonDto);
    return this.reasonRepository.save(reason);
  }

  // remove.
  async remove(id: number) {
    const reason = await this.findOneById(id);
    if (!reason) {
      throw new NotFoundException('Reason not found.');
    }
    return this.reasonRepository.remove(reason);
  }
}
