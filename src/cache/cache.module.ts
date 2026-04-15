import { Module, Global, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS = Symbol('REDIS');

@Global()
@Module({
  providers: [
    {
      provide: REDIS,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('database.redis.host');
        if (!host) {
          Logger.warn(
            'REDIS_HOST is not configured – Redis provider returns null',
            'CacheModule',
          );
          return null;
        }

        return new Redis({
          host,
          port: config.get<number>('database.redis.port'),
          lazyConnect: true,
        });
      },
    },
  ],
  exports: [REDIS],
})
export class CacheModule {}
