import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DRIZZLE } from '../database/drizzle/drizzle.module.js';
import * as schema from '../database/drizzle/schema.js';
import { CatenoidService } from '../catenoid/catenoid.service.js';
import { generateKollusPlayToken } from '../catenoid/kollus-jwt.util.js';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly securityKey: string;
  private readonly customKey: string;

  constructor(
    @Inject(DRIZZLE) private readonly db: MySql2Database<typeof schema>,
    private readonly catenoidService: CatenoidService,
    private readonly config: ConfigService,
  ) {
    this.securityKey = this.config.get<string>('catenoid.securityKey')!;
    this.customKey = this.config.get<string>('catenoid.customKey')!;
  }

  // ─── Live ───────────────────────────────────────────

  async createLiveChannel(name: string, uploaderId: number) {
    const channel = await this.catenoidService.createLiveChannel(name);

    const [result] = await this.db.insert(schema.videoContents).values({
      title: name,
      contentType: 'live',
      status: 'live',
      catenoidKey: channel.key,
      channelKey: channel.key,
      rtmpUrl: channel.rtmp_url,
      streamKey: channel.stream_key,
      uploaderId,
    });

    return {
      id: result.insertId,
      channelKey: channel.key,
      rtmpUrl: channel.rtmp_url,
      streamKey: channel.stream_key,
    };
  }

  async getLiveChannel(channelKey: string) {
    return this.catenoidService.getLiveChannel(channelKey);
  }

  // ─── VOD ────────────────────────────────────────────

  async requestUploadToken(title: string, description: string | undefined, uploaderId: number, categoryKey?: string) {
    const tokenData = await this.catenoidService.getUploadToken(title, categoryKey);

    const [result] = await this.db.insert(schema.videoContents).values({
      title,
      description: description ?? null,
      contentType: 'vod',
      status: 'uploading',
      uploaderId,
    });

    return {
      videoContentId: result.insertId,
      uploadUrl: tokenData.upload_url,
      uploadToken: tokenData.upload_token,
      progressUrl: tokenData.progress_url,
    };
  }

  async handleTranscodeCallback(
    mediaContentKey: string,
    status: string,
    duration?: number,
    thumbnailUrl?: string,
  ) {
    this.logger.log(`Transcode callback: key=${mediaContentKey} status=${status}`);

    const [existing] = await this.db
      .select()
      .from(schema.videoContents)
      .where(eq(schema.videoContents.catenoidKey, mediaContentKey))
      .limit(1);

    if (!existing) {
      // First time callback — update the record that's still uploading
      this.logger.warn(`No record found for catenoid key: ${mediaContentKey}`);
      return;
    }

    const newStatus = status === 'completed' ? 'ready' as const : 'failed' as const;

    await this.db
      .update(schema.videoContents)
      .set({
        status: newStatus,
        catenoidKey: mediaContentKey,
        duration: duration ?? existing.duration,
        thumbnailUrl: thumbnailUrl ?? existing.thumbnailUrl,
      })
      .where(eq(schema.videoContents.id, existing.id));

    return { id: existing.id, status: newStatus };
  }

  async listVodContents(page = 1, perPage = 20) {
    const offset = (page - 1) * perPage;

    const items = await this.db
      .select()
      .from(schema.videoContents)
      .where(eq(schema.videoContents.contentType, 'vod'))
      .limit(perPage)
      .offset(offset);

    return { items, page, perPage };
  }

  async generatePlayUrl(videoContentId: number, userId: string) {
    const [content] = await this.db
      .select()
      .from(schema.videoContents)
      .where(eq(schema.videoContents.id, videoContentId))
      .limit(1);

    if (!content || !content.catenoidKey) {
      throw new NotFoundException('Video content not found or not ready');
    }

    const jwt = generateKollusPlayToken(this.securityKey, {
      userId,
      mediaContentKeys: [content.catenoidKey],
      expiresInSeconds: 7200,
    });

    return {
      playUrl: `https://v.kr.kollus.com/s?jwt=${jwt}&custom_key=${this.customKey}`,
      jwt,
      videoContent: content,
    };
  }
}
