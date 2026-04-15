import { Module, Global } from '@nestjs/common';
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
        const uri = config.get<string>('database.mongo.uri')!;
        const connection = await mongoose.connect(uri);
        return connection;
      },
    },
  ],
  exports: [MONGOOSE],
})
export class MongooseModule {}
