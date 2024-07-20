import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get<number>('APP_PORT', 3000);
  const config = new DocumentBuilder()
    .setTitle('Marom Medical')
    .setDescription('The Marom Medical API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  SwaggerModule.setup('api', app, document);
  await app.listen(port);
}
bootstrap();
