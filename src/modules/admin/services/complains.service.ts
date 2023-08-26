import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsRelations, Repository } from 'typeorm';
import { Complain } from '../../shared/entities/complain.entity';
import { FindAllComplainsDto } from '../dtos/find-all-complains.dto';
import { UpdateComplainStatusDto } from '../dtos/update-complain-status.dto';
import { Helpers } from '../../../core/helpers';
import { DateFilterOption } from '../enums/date-filter-options.enum';

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
  async findAll(findAllComplainsDto: FindAllComplainsDto) {
    const offset = (findAllComplainsDto.page - 1) * findAllComplainsDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findAllComplainsDto.dateFilterOption) {
      if (findAllComplainsDto.dateFilterOption === DateFilterOption.CUSTOM) {
        dateRange = {
          startDate: findAllComplainsDto.startDate,
          endDate: findAllComplainsDto.endDate,
        };
      } else {
        dateRange = Helpers.getDateRangeForFilterOption(
          findAllComplainsDto.dateFilterOption,
        );
      }
    }
    const [complains, count] = await this.complainRepository.findAndCount({
      where: {
        serviceType: findAllComplainsDto.serviceType,
        complainerUserType: findAllComplainsDto.userType,
        status: findAllComplainsDto.status,
        createdAt: dateRange
          ? Between(dateRange.startDate, dateRange.endDate)
          : null,
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
