import { Module, Global } from '@nestjs/common';
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
        return new Redis({
          host: config.get<string>('database.redis.host'),
          port: config.get<number>('database.redis.port'),
          lazyConnect: true,
        });
      },
    },
  ],
  exports: [REDIS],
})
export class CacheModule {}
