import { Module } from '@nestjs/common';
import { CatenoidModule } from '../catenoid/catenoid.module.js';
import { MediaService } from './media.service.js';
import { MediaController } from './media.controller.js';

@Module({
  imports: [CatenoidModule],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
