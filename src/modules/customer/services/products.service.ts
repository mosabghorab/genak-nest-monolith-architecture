import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { FindAllProductsDto } from '../dtos/find-all-products.dto';
import { Product } from '../../shared/entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // find all.
  findAll(
    finalAllProductDto: FindAllProductsDto,
    relations?: FindOptionsRelations<Product>,
  ) {
    return this.productRepository.find({
      where: { serviceType: finalAllProductDto.serviceType, active: true },
      relations,
    });
  }
}
