import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsRelations, Repository } from 'typeorm';
import { Complain } from '../../../shared/entities/complain.entity';
import { FindAllComplainsDto } from '../dtos/complains/find-all-complains.dto';
import { UpdateComplainStatusDto } from '../dtos/complains/update-complain-status.dto';
import { DateFilterOption } from '../../enums/date-filter-options.enum';
import { DateHelpers } from '../../../../core/helpers/date.helpers';

@Injectable()
export class ComplainsService {
  constructor(
    @InjectRepository(Complain)
    private readonly complainRepository: Repository<Complain>,
  ) {}

  // find one by id.
  async findOneById(id: number, relations?: FindOptionsRelations<Complain>): Promise<Complain | null> {
    return this.complainRepository.findOne({
      where: { id },
      relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, failureMessage?: string, relations?: FindOptionsRelations<Complain>): Promise<Complain> {
    const complain: Complain = await this.findOneById(id, relations);
    if (!complain) {
      throw new NotFoundException(failureMessage || 'Complain not found.');
    }
    return complain;
  }

  // find all.
  async findAll(findAllComplainsDto: FindAllComplainsDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Complain[];
    currentPage: number;
  }> {
    const offset: number = (findAllComplainsDto.page - 1) * findAllComplainsDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findAllComplainsDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: findAllComplainsDto.startDate,
        endDate: findAllComplainsDto.endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(findAllComplainsDto.dateFilterOption);
    }
    const [complains, count]: [Complain[], number] = await this.complainRepository.findAndCount({
      where: {
        serviceType: findAllComplainsDto.serviceType,
        complainerUserType: findAllComplainsDto.userType,
        status: findAllComplainsDto.status,
        createdAt: dateRange ? Between(dateRange.startDate, dateRange.endDate) : null,
      },
      relations: { order: true },
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
  async updateStatus(id: number, updateComplainStatusDto: UpdateComplainStatusDto): Promise<Complain> {
    const complain: Complain = await this.findOneOrFailById(id);
    complain.status = updateComplainStatusDto.status;
    return this.complainRepository.save(complain);
  }

  // remove.
  async remove(id: number): Promise<Complain> {
    const complain: Complain = await this.findOneOrFailById(id);
    return this.complainRepository.remove(complain);
  }
}
