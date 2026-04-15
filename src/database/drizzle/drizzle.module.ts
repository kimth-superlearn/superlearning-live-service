import { Module, Global, Logger } from '@nestjs/common';
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
      useFactory: (
        config: ConfigService,
      ): MySql2Database<typeof schema> | null => {
        const host = config.get<string>('database.mysql.host');
        if (!host) {
          Logger.warn(
            'MYSQL_HOST is not configured – Drizzle provider returns null',
            'DrizzleModule',
          );
          return null;
        }

        try {
          const pool = mysql.createPool({
            host,
            port: config.get<number>('database.mysql.port'),
            user: config.get<string>('database.mysql.user'),
            password: config.get<string>('database.mysql.password'),
            database: config.get<string>('database.mysql.database'),
          });
          return drizzle(pool, { schema, mode: 'default' });
        } catch (err) {
          Logger.error(
            `MySQL connection failed – Drizzle provider returns null: ${String(err)}`,
            'DrizzleModule',
          );
          return null;
        }
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
