import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export default new DataSource({
  type: 'postgres',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),

  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],

  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  migrationsRun: false,
  logging: true,
});
