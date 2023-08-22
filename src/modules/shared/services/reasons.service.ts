import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Reason } from '../../shared/entities/reason.entity';

@Injectable()
export class ReasonsService {
  constructor(
    @InjectRepository(Reason)
    private readonly reasonRepository: Repository<Reason>,
  ) {}

  // find one by id.
  async findOneById(id: number, relations?: FindOptionsRelations<Reason>) {
    return this.reasonRepository.findOne({
      where: { id, active: true },
      relations,
    });
  }

  // find all.
  async findAll(relations?: FindOptionsRelations<Reason>) {
    return this.reasonRepository.find({
      where: { active: true },
      relations,
    });
  }
}
