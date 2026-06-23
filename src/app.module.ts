import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    // Puedo agrupar configuracion en otro archivo con registerAs y luego cargarlo con load aqui para
    // mas orden.
    ConfigModule.forRoot({
      isGlobal: true, // Disponible en toda la app.
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'], // NODE_ENV se entrega en los scripts de package.json
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        PORT: Joi.number().required(),
        CORS_ORIGIN: Joi.string().required(),
        DB_HOST: Joi.required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        TIME_TO_LIVE: Joi.number().required(),
        RATE_LIMIT: Joi.number().required(),
        DB_SYNCHRONIZE: Joi.string().required(),
        JWT_EXPIRES: Joi.string().required(),
      }),
    }),
    // Configuracion de TypeOrmModule. Uso de forRootAsync para utilizar useFactory.
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',

        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),

        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),

        autoLoadEntities: true,
        synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true',
        logging: true,
      }),
    }),
    // Debo recordar que con servidores/proxies detras se rompe el rate limiting y debo habilitar trust
    // proxy en main.ts.
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('TIME_TO_LIVE') as number, // time to live de 60 seg.
          limit: config.get<number>('RATE_LIMIT') as number, // limite de 10 request en 60 seg a una ruta.
        },
      ],
    }),
    UsersModule,
    AuthModule,
    ProjectsModule,
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
