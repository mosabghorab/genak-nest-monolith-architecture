import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Product } from '../../shared/entities/product.entity';
import { FindAllProductsDto } from '../dtos/find-all-products.dto';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { CreateProductUploadedFilesDto } from '../dtos/create-product-uploaded-files.dto';
import { Helpers } from '../../../core/helpers';
import { Constants } from '../../../core/constants';
import { UpdateProductUploadedFilesDto } from '../dtos/update-product-uploaded-files.dto';
import { unlinkSync } from 'fs';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Product>) {
    return this.productRepository.findOne({
      where: { id },
      relations,
    });
  }

  // find all.
  async findAll(
    findAllProductsDto: FindAllProductsDto,
    relations?: FindOptionsRelations<Product>,
  ) {
    return this.productRepository.find({
      where: {
        serviceType: findAllProductsDto.serviceType,
      },
      relations,
    });
  }

  // create.
  async create(
    createProductDto: CreateProductDto,
    createProductUploadedFilesDto: CreateProductUploadedFilesDto,
  ) {
    await Helpers.saveFile(
      Constants.productsImagesPath,
      createProductUploadedFilesDto.image.name,
      createProductUploadedFilesDto.image,
    );
    return this.productRepository.save(
      await this.productRepository.create({
        image: createProductUploadedFilesDto.image.name,
        ...createProductDto,
      }),
    );
  }

  // update.
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    updateProductUploadedFilesDto: UpdateProductUploadedFilesDto,
  ) {
    const product = await this.findOneById(id);
    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    if (updateProductUploadedFilesDto.image) {
      unlinkSync(Constants.productsImagesPath + product.image);
      await Helpers.saveFile(
        Constants.productsImagesPath,
        updateProductUploadedFilesDto.image.name,
        updateProductUploadedFilesDto.image,
      );
      product.image = updateProductUploadedFilesDto.image.name;
    }
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  // remove.
  async remove(id: number) {
    const product = await this.findOneById(id);
    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    return this.productRepository.remove(product);
  }
}
