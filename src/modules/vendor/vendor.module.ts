import { Module } from '@nestjs/common';
import { AuthController } from './v1/controllers/auth.controller';
import { AuthService } from './v1/services/auth.service';
import { VendorsService } from './v1/services/vendors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from '../shared/entities/vendor.entity';
import { SharedModule } from '../shared/shared.module';
import { DocumentsService } from './v1/services/documents.service';
import { Document } from '../shared/entities/document.entity';
import { AttachmentsService } from './v1/services/attachments.service';
import { Attachment } from '../shared/entities/attachment.entity';
import { ProfileService } from './v1/services/profile.service';
import { ProfileController } from './v1/controllers/profile.controller';
import { OrdersService } from './v1/services/orders.service';
import { OrdersController } from './v1/controllers/orders.controller';
import { Order } from '../shared/entities/order.entity';
import { Review } from '../shared/entities/review.entity';
import { ReviewsService } from './v1/services/reviews.service';
import { ReviewsController } from './v1/controllers/reviews.controller';
import { Customer } from '../shared/entities/customer.entity';
import { CustomersService } from './v1/services/customers.service';
import { Complain } from '../shared/entities/complain.entity';
import { ComplainsController } from './v1/controllers/complains.controller';
import { ComplainsService } from './v1/services/complains.service';
import { VendorsValidation } from './v1/validations/vendors.validation';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor, Document, Attachment, Order, Review, Customer, Complain]), SharedModule],
  controllers: [AuthController, ProfileController, OrdersController, ReviewsController, ComplainsController],
  providers: [AuthService, VendorsService, DocumentsService, AttachmentsService, ProfileService, OrdersService, ReviewsService, CustomersService, ComplainsService, VendorsValidation],
})
export class VendorModule {}
