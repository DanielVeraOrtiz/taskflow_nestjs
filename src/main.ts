import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ConsoleLogger } from '@nestjs/common';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'HOLIWI',
      timestamp: true,
    }),
  });
  // Usamos logger morgan para tener en consola respuestas de los endpoints.
  app.use(morgan('dev'));

  // Le pedimos el configService, ya que antes en el create de Nest, ya creo que contenedor de DI.
  const configService = app.get(ConfigService);
  // Mientras se desarrolla se configura para aceptar peticiones de cualquier dominio.
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN'),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  // Esta en la documentacion, agrega varios headers HTTP de seguridad en las respuestas, como
  // X-Content-Type-Options: nosniff, X-Frame-Options: SAMEORIGIN, Referrer-Policy: no-referrer.
  app.use(helmet());
  await app.listen(configService.get<number>('PORT') ?? 3000);
}

// Cambio debido a que me indica que las promesas deben ser esperadas con su catch y then.
void bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
