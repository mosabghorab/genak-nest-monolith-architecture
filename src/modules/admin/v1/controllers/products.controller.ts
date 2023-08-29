import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles } from '@nestjs/common';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { UserType } from '../../../shared/enums/user-type.enum';
import { PermissionsTarget } from '../../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../../enums/permission-group.enum';
import { AdminMustCanDo } from '../../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../../enums/permission-action.enum';
import { ProductsService } from '../services/products.service';
import { ProductDto } from '../../../shared/v1/dtos/product.dto';
import { CreateProductDto } from '../dtos/products/create-product.dto';
import { CreateProductUploadedFilesDto } from '../dtos/products/create-product-uploaded-files.dto';
import { FindAllProductsDto } from '../dtos/products/find-all-products.dto';
import { UpdateProductDto } from '../dtos/products/update-product.dto';
import { UpdateProductUploadedFilesDto } from '../dtos/products/update-product-uploaded-files.dto';
import { Product } from '../../../shared/entities/product.entity';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.PRODUCTS)
@Controller({ path: 'admin/products', version: '1' })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(ProductDto, 'Product created successfully.')
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    createProductUploadedFilesDto: CreateProductUploadedFilesDto,
  ): Promise<Product> {
    return this.productsService.create(createProductDto, createProductUploadedFilesDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(ProductDto, 'All products.')
  @Get()
  findAll(@Query() findAllProductsDto: FindAllProductsDto): Promise<Product[]> {
    return this.productsService.findAll(findAllProductsDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(ProductDto, 'One product.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productsService.findOneOrFailById(id);
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(ProductDto, 'Product updated successfully.')
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles()
    updateProductUploadedFilesDto: UpdateProductUploadedFilesDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto, updateProductUploadedFilesDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(ProductDto, 'Product deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Product> {
    return this.productsService.remove(id);
  }
}
