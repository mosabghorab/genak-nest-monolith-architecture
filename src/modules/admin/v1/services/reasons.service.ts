import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Reason } from '../../../shared/entities/reason.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReasonDto } from '../dtos/reasons/create-reason.dto';
import { UpdateReasonDto } from '../dtos/reasons/update-reason.dto';

@Injectable()
export class ReasonsService {
  constructor(
    @InjectRepository(Reason)
    private readonly reasonRepository: Repository<Reason>,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Reason>): Promise<Reason | null> {
    return this.reasonRepository.findOne({
      where: { id },
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
    return this.reasonRepository.find();
  }

  // create.
  async create(createReasonDto: CreateReasonDto): Promise<Reason> {
    return this.reasonRepository.save(await this.reasonRepository.create(createReasonDto));
  }

  // update.
  async update(id: number, updateReasonDto: UpdateReasonDto): Promise<Reason> {
    const reason: Reason = await this.findOneOrFailById(id);
    Object.assign(reason, updateReasonDto);
    return this.reasonRepository.save(reason);
  }

  // remove.
  async remove(id: number): Promise<Reason> {
    const reason = await this.findOneOrFailById(id);
    return this.reasonRepository.remove(reason);
  }
}
