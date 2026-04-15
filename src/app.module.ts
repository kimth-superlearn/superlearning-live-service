import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import configuration from './config/configuration.js';
import { DrizzleModule } from './database/drizzle/drizzle.module.js';
import { MongooseModule } from './database/mongoose/mongoose.module.js';
import { CacheModule } from './cache/cache.module.js';
import { AuthModule } from './auth/auth.module.js';
import { MediaModule } from './media/media.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: `.env.${process.env.NODE_ENV ?? 'local'}`,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'prod'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
        level: process.env.NODE_ENV === 'prod' ? 'info' : 'debug',
      },
    }),
    DrizzleModule,
    MongooseModule,
    CacheModule,
    AuthModule,
    MediaModule,
  ],
})
export class AppModule {}
