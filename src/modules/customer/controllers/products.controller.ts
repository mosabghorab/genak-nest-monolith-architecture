import { Controller, Get, Query } from '@nestjs/common';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { UserType } from '../../shared/enums/user-type.enum';
import { ProductsService } from '../services/products.service';
import { FindAllProductsDto } from '../dtos/find-all-products.dto';
import { ProductDto } from '../../shared/dtos/product.dto';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';

@AllowFor(UserType.CUSTOMER)
@Controller('customer/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Serialize(ProductDto, 'All products.')
  @Get()
  findAll(@Query() findAllProductsDto: FindAllProductsDto) {
    return this.productsService.findAll(findAllProductsDto);
  }
}
