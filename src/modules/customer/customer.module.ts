import { Module } from '@nestjs/common';
import { AuthController } from './v1/controllers/auth.controller';
import { CustomerAddressesController } from './v1/controllers/customer-addresses.controller';
import { ProductsController } from './v1/controllers/products.controller';
import { ProfileController } from './v1/controllers/profile.controller';
import { VendorsController } from './v1/controllers/vendors.controller';
import { AuthService } from './v1/services/auth.service';
import { CustomerAddressesService } from './v1/services/customer-addresses.service';
import { ProductsService } from './v1/services/products.service';
import { ProfileService } from './v1/services/profile.service';
import { VendorsService } from './v1/services/vendors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from '../shared/entities/vendor.entity';
import { CustomerAddress } from './entities/customer-address.entity';
import { Product } from '../shared/entities/product.entity';
import { CustomersService } from './v1/services/customers.service';
import { Customer } from '../shared/entities/customer.entity';
import { OrdersController } from './v1/controllers/orders.controller';
import { OrdersService } from './v1/services/orders.service';
import { Order } from '../shared/entities/order.entity';
import { Complain } from '../shared/entities/complain.entity';
import { ComplainsController } from './v1/controllers/complains.controller';
import { ComplainsService } from './v1/services/complains.service';
import { SharedModule } from '../shared/shared.module';
import { ReviewsService } from './v1/services/reviews.service';
import { ReviewsController } from './v1/controllers/reviews.controller';
import { Review } from '../shared/entities/review.entity';
import { CustomersValidation } from './v1/validations/customers.validation';
import { VendorsValidation } from './v1/validations/vendors.validation';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Vendor, CustomerAddress, Product, Order, Complain, Review]), SharedModule],
  controllers: [AuthController, CustomerAddressesController, ProductsController, ProfileController, VendorsController, OrdersController, ComplainsController, ReviewsController],
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
    CustomersValidation,
    VendorsValidation,
  ],
})
export class CustomerModule {}
