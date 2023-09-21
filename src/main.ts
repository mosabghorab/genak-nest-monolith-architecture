import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as compression from 'compression';
import * as fileUpload from 'express-fileupload';
import { Constants } from './core/constants';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,
    }),
  );
  const configService: ConfigService = app.get(ConfigService);
  app.setGlobalPrefix('/api/');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.use(fileUpload());
  app.use(compression());
  await app.listen(configService.get<string>('PORT'));
  Constants.baseUrl = await app.getUrl();
}

bootstrap();
