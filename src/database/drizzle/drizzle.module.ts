import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.js';

export const DRIZZLE = Symbol('DRIZZLE');

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<MySql2Database<typeof schema>> => {
        const pool = mysql.createPool({
          host: config.get<string>('database.mysql.host'),
          port: config.get<number>('database.mysql.port'),
          user: config.get<string>('database.mysql.user'),
          password: config.get<string>('database.mysql.password'),
          database: config.get<string>('database.mysql.database'),
        });
        return drizzle(pool, { schema, mode: 'default' });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
