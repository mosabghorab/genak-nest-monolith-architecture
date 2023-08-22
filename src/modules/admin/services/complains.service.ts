import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { Complain } from '../../shared/entities/complain.entity';
import { FindAllComplainsDto } from '../dtos/find-all-complains.dto';
import { UpdateComplainStatusDto } from '../dtos/update-complain-status.dto';

@Injectable()
export class ComplainsService {
  constructor(
    @InjectRepository(Complain)
    private readonly complainRepository: Repository<Complain>,
  ) {}

  // find one by id.
  async findOneById(id: number, relations?: FindOptionsRelations<Complain>) {
    return this.complainRepository.findOne({
      where: { id },
      relations,
    });
  }

  // find all.
  async findAll(
    findAllComplainsDto: FindAllComplainsDto,
    relations?: FindOptionsRelations<Complain>,
  ) {
    const offset = (findAllComplainsDto.page - 1) * findAllComplainsDto.limit;
    const [complains, count] = await this.complainRepository.findAndCount({
      where: {
        serviceType: findAllComplainsDto.serviceType,
        complainerUserType: findAllComplainsDto.userType,
      },
      relations,
      skip: offset,
      take: findAllComplainsDto.limit,
    });
    return {
      perPage: findAllComplainsDto.limit,
      currentPage: findAllComplainsDto.page,
      lastPage: Math.ceil(count / findAllComplainsDto.limit),
      total: count,
      data: complains,
    };
  }

  // update status.
  async updateStatus(
    id: number,
    updateComplainStatusDto: UpdateComplainStatusDto,
  ) {
    const complain = await this.findOneById(id);
    if (!complain) {
      throw new NotFoundException('Complain not found.');
    }
    complain.status = updateComplainStatusDto.status;
    return this.complainRepository.save(complain);
  }

  // remove.
  async remove(id: number) {
    const complain = await this.findOneById(id);
    if (!complain) {
      throw new NotFoundException('Complain not found.');
    }
    return this.complainRepository.remove(complain);
  }
}
