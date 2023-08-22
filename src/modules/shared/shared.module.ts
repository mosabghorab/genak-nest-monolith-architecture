import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Reason } from './entities/reason.entity';
import { ReasonsController } from './controllers/reasons.controller';
import { LocationsService } from './services/locations.service';
import { LocationsController } from './controllers/locations.controller';
import { Location } from './entities/location.entity';
import { ReasonsService } from './services/reasons.service';
import { OnBoardingScreensService } from './services/on-boarding-screens.service';
import { OnBoardingScreensController } from './controllers/on-boarding-screens.controller';
import { OnBoardingScreen } from './entities/on-boarding-screen.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Reason, Location, OnBoardingScreen]),
  ],
  controllers: [
    OrdersController,
    ReasonsController,
    LocationsController,
    OnBoardingScreensController,
  ],
  providers: [
    OrdersService,
    LocationsService,
    ReasonsService,
    OnBoardingScreensService,
  ],
  exports: [LocationsService],
})
export class SharedModule {}
