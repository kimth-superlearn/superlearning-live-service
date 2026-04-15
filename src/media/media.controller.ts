import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { createReadStream, statSync } from 'node:fs';
import { join } from 'node:path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { MediaService } from './media.service.js';
import {
  CreateLiveChannelDto,
  RequestUploadTokenDto,
  TranscodeCallbackDto,
  PlayTokenRequestDto,
} from './media.dto.js';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  private readonly logger = new Logger(MediaController.name);

  constructor(private readonly mediaService: MediaService) {}

  // ─── Live ───────────────────────────────────────────

  @Post('live/channels')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a live streaming channel via Catenoid' })
  async createLiveChannel(
    @Body() dto: CreateLiveChannelDto,
    @Req() req: FastifyRequest & { user: { id: number } },
  ) {
    return this.mediaService.createLiveChannel(dto.name, req.user.id);
  }

  @Get('live/channels/:channelKey')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get live channel info from Catenoid' })
  @ApiParam({ name: 'channelKey', description: 'Catenoid channel key' })
  async getLiveChannel(@Param('channelKey') channelKey: string) {
    return this.mediaService.getLiveChannel(channelKey);
  }

  // ─── VOD ────────────────────────────────────────────

  @Get('vod')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List VOD contents' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  async listVodContents(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    return this.mediaService.listVodContents(
      page ? parseInt(page, 10) : 1,
      perPage ? parseInt(perPage, 10) : 20,
    );
  }

  @Post('vod/upload-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Request Catenoid upload token for VOD upload' })
  async requestUploadToken(
    @Body() dto: RequestUploadTokenDto,
    @Req() req: FastifyRequest & { user: { id: number } },
  ) {
    return this.mediaService.requestUploadToken(
      dto.title,
      dto.description,
      req.user.id,
      dto.categoryKey,
    );
  }

  @Post('vod/play-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate Kollus play URL with JWT for a video' })
  async generatePlayToken(
    @Body() dto: PlayTokenRequestDto,
    @Req() req: FastifyRequest & { user: { id: number } },
  ) {
    return this.mediaService.generatePlayUrl(
      dto.videoContentId,
      String(req.user.id),
    );
  }

  // ─── Webhook ────────────────────────────────────────

  @Post('webhook/transcode')
  @ApiOperation({ summary: 'Receive Catenoid transcoding callback' })
  async transcodeCallback(@Body() dto: TranscodeCallbackDto) {
    this.logger.log(`Transcode webhook received: ${dto.media_content_key}`);
    return this.mediaService.handleTranscodeCallback(
      dto.media_content_key,
      dto.status,
      dto.duration,
      dto.thumbnail_url,
    );
  }

  // ─── Local File Stream (Range-based) ───────────────

  @Get('stream/:filename')
  @ApiOperation({
    summary: 'Stream a local file with HTTP Range support (Fastify)',
  })
  @ApiParam({ name: 'filename', description: 'File name in storage directory' })
  async streamFile(
    @Param('filename') filename: string,
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply,
  ) {
    const storagePath = join(process.cwd(), 'storage');
    const filePath = join(storagePath, filename);

    let stat: import('node:fs').Stats;
    try {
      stat = statSync(filePath);
    } catch {
      return reply.status(404).send({ message: 'File not found' });
    }

    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const stream = createReadStream(filePath, { start, end });

      return reply
        .status(206)
        .header('Content-Range', `bytes ${start}-${end}/${fileSize}`)
        .header('Accept-Ranges', 'bytes')
        .header('Content-Length', chunkSize)
        .header('Content-Type', 'video/mp4')
        .send(stream);
    }

    const stream = createReadStream(filePath);
    return reply
      .status(200)
      .header('Content-Length', fileSize)
      .header('Content-Type', 'video/mp4')
      .send(stream);
  }
}
