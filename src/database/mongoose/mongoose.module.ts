import { Module, Global, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

export const MONGOOSE = Symbol('MONGOOSE');

@Global()
@Module({
  providers: [
    {
      provide: MONGOOSE,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const uri = config.get<string>('database.mongo.uri');
        if (!uri) {
          Logger.warn(
            'MONGO_URI is not configured – Mongoose provider returns null',
            'MongooseModule',
          );
          return null;
        }

        try {
          const connection = await mongoose.connect(uri);
          return connection;
        } catch (err) {
          Logger.error(
            `MongoDB connection failed – Mongoose provider returns null: ${String(err)}`,
            'MongooseModule',
          );
          return null;
        }
      },
    },
  ],
  exports: [MONGOOSE],
})
export class MongooseModule {}
