import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Reason } from '../../entities/reason.entity';

@Injectable()
export class ReasonsService {
  constructor(
    @InjectRepository(Reason)
    private readonly reasonRepository: Repository<Reason>,
  ) {}

  // find one by id.
  async findOneById(id: number, relations?: FindOptionsRelations<Reason>): Promise<Reason | null> {
    return this.reasonRepository.findOne({
      where: { id, active: true },
      relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, failureMessage?: string, relations?: FindOptionsRelations<Reason>): Promise<Reason> {
    const reason: Reason = await this.findOneById(id, relations);
    if (!reason) {
      throw new NotFoundException(failureMessage || 'Reason not found.');
    }
    return reason;
  }

  // find all.
  findAll(): Promise<Reason[]> {
    return this.reasonRepository.find({
      where: { active: true },
    });
  }
}
