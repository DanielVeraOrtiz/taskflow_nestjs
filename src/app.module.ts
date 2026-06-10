import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    // Puedo agrupar configuracion en otro archivo con registerAs y luego cargarlo con load aqui para
    // mas orden.
    ConfigModule.forRoot({
      isGlobal: true, // Disponible en toda la app.
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    // Debo recordar que con servidores/proxies detras se rompe el rate limiting y debo habilitar trust
    // proxy en main.ts.
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // time to live de 60 seg.
        limit: 20, // limite de 20 request en 60 seg a una ruta.
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
