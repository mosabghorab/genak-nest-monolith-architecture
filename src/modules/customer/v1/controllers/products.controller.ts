import { Controller, Get, Query } from '@nestjs/common';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { UserType } from '../../../shared/enums/user-type.enum';
import { ProductsService } from '../services/products.service';
import { FindAllProductsDto } from '../dtos/find-all-products.dto';
import { ProductDto } from '../../../shared/v1/dtos/product.dto';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { Product } from '../../../shared/entities/product.entity';

@AllowFor(UserType.CUSTOMER)
@Controller({ path: 'customer/products', version: '1' })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Serialize(ProductDto, 'All products.')
  @Get()
  findAll(@Query() findAllProductsDto: FindAllProductsDto): Promise<Product[]> {
    return this.productsService.findAll(findAllProductsDto);
  }
}
