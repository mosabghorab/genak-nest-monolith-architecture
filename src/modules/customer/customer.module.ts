import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { CustomerAddressesController } from './controllers/customer-addresses.controller';
import { ProductsController } from './controllers/products.controller';
import { ProfileController } from './controllers/profile.controller';
import { VendorsController } from './controllers/vendors.controller';
import { AuthService } from './services/auth.service';
import { CustomerAddressesService } from './services/customer-addresses.service';
import { ProductsService } from './services/products.service';
import { ProfileService } from './services/profile.service';
import { VendorsService } from './services/vendors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from '../shared/entities/vendor.entity';
import { CustomerAddress } from './entities/customer-address.entity';
import { Product } from '../shared/entities/product.entity';
import { CustomersService } from './services/customers.service';
import { Customer } from '../shared/entities/customer.entity';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { Order } from '../shared/entities/order.entity';
import { Complain } from '../shared/entities/complain.entity';
import { ComplainsController } from './controllers/complains.controller';
import { ComplainsService } from './services/complains.service';
import { SharedModule } from '../shared/shared.module';
import { ReviewsService } from './services/reviews.service';
import { ReviewsController } from './controllers/reviews.controller';
import { Review } from '../shared/entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Vendor,
      CustomerAddress,
      Product,
      Order,
      Complain,
      Review,
    ]),
    SharedModule,
  ],
  controllers: [
    AuthController,
    CustomerAddressesController,
    ProductsController,
    ProfileController,
    VendorsController,
    OrdersController,
    ComplainsController,
    ReviewsController,
  ],
  providers: [
    AuthService,
    CustomerAddressesService,
    ProductsService,
    ProfileService,
    VendorsService,
    CustomersService,
    OrdersService,
    ComplainsService,
    ReviewsService,
  ],
})
export class CustomerModule {}
