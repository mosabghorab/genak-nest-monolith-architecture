import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { UserType } from '../../shared/enums/user-type.enum';
import { PermissionsTarget } from '../../../core/metadata/permissions-target.metadata';
import { PermissionsGroups } from '../enums/permissions-groups.enum';
import { AdminMustCanDo } from '../../../core/metadata/admin-must-can-do.metadata';
import { PermissionsActions } from '../enums/permissions-actions.enum';
import { ProductsService } from '../services/products.service';
import { ProductDto } from '../../shared/dtos/product.dto';
import { CreateProductDto } from '../dtos/create-product.dto';
import { CreateProductUploadedFilesDto } from '../dtos/create-product-uploaded-files.dto';
import { FindAllProductsDto } from '../dtos/find-all-products.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { UpdateProductUploadedFilesDto } from '../dtos/update-product-uploaded-files.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionsGroups.PRODUCTS)
@Controller('admin/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @AdminMustCanDo(PermissionsActions.CREATE)
  @Serialize(ProductDto, 'Product created successfully.')
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    createProductUploadedFilesDto: CreateProductUploadedFilesDto,
  ) {
    return this.productsService.create(
      createProductDto,
      createProductUploadedFilesDto,
    );
  }

  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(ProductDto, 'All products.')
  @Get()
  findAll(@Query() findAllProductsDto: FindAllProductsDto) {
    return this.productsService.findAll(findAllProductsDto);
  }

  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(ProductDto, 'One product.')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const product = await this.productsService.findOneById(id);
    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    return product;
  }

  @AdminMustCanDo(PermissionsActions.UPDATE)
  @Serialize(ProductDto, 'Product updated successfully.')
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles()
    updateProductUploadedFilesDto: UpdateProductUploadedFilesDto,
  ) {
    return this.productsService.update(
      id,
      updateProductDto,
      updateProductUploadedFilesDto,
    );
  }

  @AdminMustCanDo(PermissionsActions.DELETE)
  @Serialize(ProductDto, 'Product deleted successfully.')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.productsService.remove(id);
  }
}
