import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Esta en la documentacion, agrega varios headers HTTP de seguridad en las respuestas, como
  // X-Content-Type-Options: nosniff, X-Frame-Options: SAMEORIGIN, Referrer-Policy: no-referrer.
  app.use(helmet());
  await app.listen(process.env.PORT ?? 3000);
}

// Cambio debido a que me indica que las promesas deben ser esperadas con su catch y then.
void bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
