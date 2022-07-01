import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import useConfig from './config/configuration';

const config = useConfig();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(config.port);
}
bootstrap();
