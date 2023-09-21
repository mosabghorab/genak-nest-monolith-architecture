import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Product } from '../../../shared/entities/product.entity';
import { FindAllProductsDto } from '../dtos/products/find-all-products.dto';
import { CreateProductDto } from '../dtos/products/create-product.dto';
import { UpdateProductDto } from '../dtos/products/update-product.dto';
import { CreateProductUploadedFilesDto } from '../dtos/products/create-product-uploaded-files.dto';
import { Helpers } from '../../../../core/helpers/helpers';
import { Constants } from '../../../../core/constants';
import { UpdateProductUploadedFilesDto } from '../dtos/products/update-product-uploaded-files.dto';
import { unlinkSync } from 'fs';
import { ServiceType } from '../../../shared/enums/service-type.enum';
import { DateFilterOption } from '../../enums/date-filter-options.enum';
import { DateHelpers } from '../../../../core/helpers/date.helpers';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Product>): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id },
      relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, failureMessage?: string, relations?: FindOptionsRelations<Product>): Promise<Product> {
    const product: Product = await this.findOneById(id, relations);
    if (!product) {
      throw new NotFoundException(failureMessage || 'Product not found.');
    }
    return product;
  }

  // find all.
  findAll(findAllProductsDto: FindAllProductsDto): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        serviceType: findAllProductsDto.serviceType,
      },
    });
  }

  // create.
  async create(createProductDto: CreateProductDto, createProductUploadedFilesDto: CreateProductUploadedFilesDto): Promise<Product> {
    await Helpers.saveFile(Constants.productsImagesPath, createProductUploadedFilesDto.image.name, createProductUploadedFilesDto.image);
    return this.productRepository.save(
      await this.productRepository.create({
        image: createProductUploadedFilesDto.image.name,
        ...createProductDto,
      }),
    );
  }

  // update.
  async update(id: number, updateProductDto: UpdateProductDto, updateProductUploadedFilesDto: UpdateProductUploadedFilesDto): Promise<Product> {
    const product: Product = await this.findOneOrFailById(id);
    if (updateProductUploadedFilesDto.image) {
      unlinkSync(Constants.productsImagesPath + product.image);
      await Helpers.saveFile(Constants.productsImagesPath, updateProductUploadedFilesDto.image.name, updateProductUploadedFilesDto.image);
      product.image = updateProductUploadedFilesDto.image.name;
    }
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  // remove.
  async remove(id: number): Promise<Product> {
    const product: Product = await this.findOneOrFailById(id);
    return this.productRepository.remove(product);
  }

  // find with total sales.
  async findWithTotalSales(serviceType: ServiceType, dateFilterOption?: DateFilterOption, startDate?: Date, endDate?: Date): Promise<Product[]> {
    let dateRange: { startDate: Date; endDate: Date };
    if (dateFilterOption) {
      if (dateFilterOption === DateFilterOption.CUSTOM) {
        dateRange = {
          startDate: startDate,
          endDate: endDate,
        };
      } else {
        dateRange = DateHelpers.getDateRangeForDateFilterOption(dateFilterOption);
      }
    }
    const {
      entities,
      raw,
    }: {
      entities: Product[];
      raw: any[];
    } = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin(
        'product.orderItems',
        'orderItem',
        dateFilterOption ? 'orderItem.createdAt BETWEEN :startDate AND :endDate' : null,
        dateFilterOption
          ? {
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
            }
          : null,
      )
      .addSelect('SUM(orderItem.price * orderItem.quantity)', 'total_sales')
      .where('product.serviceType = :serviceType', { serviceType })
      .groupBy('product.id')
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['totalSales'] = parseFloat(raw[i]['total_sales']) || 0;
    }
    return entities;
  }

  // find with orders count.
  async findWithOrdersCount(serviceType: ServiceType, dateFilterOption: DateFilterOption, startDate: Date, endDate: Date): Promise<Product[]> {
    let dateRange: { startDate: Date; endDate: Date };
    if (dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: startDate,
        endDate: endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(dateFilterOption);
    }
    const {
      entities,
      raw,
    }: {
      entities: Product[];
      raw: any[];
    } = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.orderItems', 'orderItem')
      .leftJoin('orderItem.order', 'order', 'order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      })
      .addSelect('COUNT(DISTINCT order.id)', 'orders_count')
      .where('product.serviceType = :serviceType', { serviceType })
      .groupBy('product.id')
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['ordersCount'] = parseInt(raw[i]['orders_count']) || 0;
    }
    return entities;
  }
}
