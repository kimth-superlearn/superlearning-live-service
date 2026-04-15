import { Module } from '@nestjs/common';
import { CatenoidService } from './catenoid.service.js';

@Module({
  providers: [CatenoidService],
  exports: [CatenoidService],
})
export class CatenoidModule {}
