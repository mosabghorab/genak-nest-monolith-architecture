import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Customer } from '../../../shared/entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Customer>): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { id },
      relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, failureMessage?: string, relations?: FindOptionsRelations<Customer>): Promise<Customer> {
    const customer: Customer = await this.findOneById(id, relations);
    if (!customer) {
      throw new NotFoundException(failureMessage || 'Customer not found.');
    }
    return customer;
  }
}
