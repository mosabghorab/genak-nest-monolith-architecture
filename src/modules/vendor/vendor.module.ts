import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { VendorsService } from './services/vendors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from '../shared/entities/vendor.entity';
import { SharedModule } from '../shared/shared.module';
import { DocumentsService } from './services/documents.service';
import { Document } from '../shared/entities/document.entity';
import { AttachmentsService } from './services/attachments.service';
import { Attachment } from '../shared/entities/attachment.entity';
import { ProfileService } from './services/profile.service';
import { ProfileController } from './controllers/profile.controller';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { Order } from '../shared/entities/order.entity';
import { Review } from '../shared/entities/review.entity';
import { ReviewsService } from './services/reviews.service';
import { ReviewsController } from './controllers/reviews.controller';
import { Customer } from '../shared/entities/customer.entity';
import { CustomersService } from './services/customers.service';
import { Complain } from '../shared/entities/complain.entity';
import { ComplainsController } from './controllers/complains.controller';
import { ComplainsService } from './services/complains.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vendor,
      Document,
      Attachment,
      Order,
      Review,
      Customer,
      Complain,
    ]),
    SharedModule,
  ],
  controllers: [
    AuthController,
    ProfileController,
    OrdersController,
    ReviewsController,
    ComplainsController,
  ],
  providers: [
    AuthService,
    VendorsService,
    DocumentsService,
    AttachmentsService,
    ProfileService,
    OrdersService,
    ReviewsService,
    CustomersService,
    ComplainsService,
  ],
})
export class VendorModule {}
