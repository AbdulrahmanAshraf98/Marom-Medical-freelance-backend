import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptor/response/response.interceptor';
import { TranslationService } from './common/service/translation/translation.service';
import { AllExceptionFilter } from './common/filter/all-exception/all-exception.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { I18nMiddleware } from 'nestjs-i18n'; // Import NestExpressApplication

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // Cast to NestExpressApplication
  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get<number>('APP_PORT', 3000);
  const config = new DocumentBuilder()
    .setTitle('Marom Medical')
    .setDescription('The Marom Medical API description')
    .setVersion('1.0')
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  const translationService: TranslationService = app.get(TranslationService);
  const reflector: Reflector = app.get(Reflector);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transforms payloads into DTO instances
      whitelist: true, // Strips properties that do not have decorators
    }),
  );
  app.useGlobalInterceptors(
    new ResponseInterceptor(translationService,reflector),
  );
  app.useGlobalFilters(new AllExceptionFilter(translationService));
  app.use(I18nMiddleware);

  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
