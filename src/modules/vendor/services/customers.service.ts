import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Customer } from '../../shared/entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Customer>) {
    return this.customerRepository.findOne({
      where: { id },
      relations,
    });
  }
}
