import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface CatenoidChannelResponse {
  key: string;
  name: string;
  rtmp_url: string;
  stream_key: string;
  status: string;
}

export interface CatenoidUploadTokenResponse {
  upload_url: string;
  upload_token: string;
  progress_url: string;
}

export interface CatenoidMediaContentResponse {
  key: string;
  title: string;
  duration: number;
  thumbnail_url: string;
  status: string;
}

@Injectable()
export class CatenoidService {
  private readonly logger = new Logger(CatenoidService.name);
  private readonly baseUrl: string;
  private readonly serviceAccountKey: string;
  private readonly apiAccessToken: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get<string>('catenoid.apiBaseUrl')!;
    this.serviceAccountKey = this.config.get<string>('catenoid.serviceAccountKey')!;
    this.apiAccessToken = this.config.get<string>('catenoid.apiAccessToken')!;
  }

  // ─── Live ───────────────────────────────────────────

  async createLiveChannel(name: string): Promise<CatenoidChannelResponse> {
    this.logger.log(`Creating live channel: ${name}`);

    const response = await fetch(
      `${this.baseUrl}/0/channels`,
      {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify({
          name,
          service_account_key: this.serviceAccountKey,
        }),
      },
    );

    return this.handleResponse<CatenoidChannelResponse>(response, 'createLiveChannel');
  }

  async getLiveChannel(channelKey: string): Promise<CatenoidChannelResponse> {
    this.logger.log(`Getting live channel: ${channelKey}`);

    const response = await fetch(
      `${this.baseUrl}/0/channels/${channelKey}`,
      {
        method: 'GET',
        headers: this.buildHeaders(),
      },
    );

    return this.handleResponse<CatenoidChannelResponse>(response, 'getLiveChannel');
  }

  async listLiveChannels(): Promise<CatenoidChannelResponse[]> {
    this.logger.log('Listing live channels');

    const response = await fetch(
      `${this.baseUrl}/0/channels?service_account_key=${this.serviceAccountKey}`,
      {
        method: 'GET',
        headers: this.buildHeaders(),
      },
    );

    const data = await this.handleResponse<{ items: CatenoidChannelResponse[] }>(
      response,
      'listLiveChannels',
    );
    return data.items;
  }

  // ─── VOD ────────────────────────────────────────────

  async getUploadToken(title: string, categoryKey?: string): Promise<CatenoidUploadTokenResponse> {
    this.logger.log(`Requesting upload token for: ${title}`);

    const body: Record<string, string> = {
      service_account_key: this.serviceAccountKey,
      title,
    };
    if (categoryKey) {
      body.category_key = categoryKey;
    }

    const response = await fetch(
      `${this.baseUrl}/0/media_auth/upload/url`,
      {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify(body),
      },
    );

    return this.handleResponse<CatenoidUploadTokenResponse>(response, 'getUploadToken');
  }

  async getMediaContent(mediaContentKey: string): Promise<CatenoidMediaContentResponse> {
    this.logger.log(`Getting media content: ${mediaContentKey}`);

    const response = await fetch(
      `${this.baseUrl}/0/media_contents/${mediaContentKey}?service_account_key=${this.serviceAccountKey}`,
      {
        method: 'GET',
        headers: this.buildHeaders(),
      },
    );

    return this.handleResponse<CatenoidMediaContentResponse>(response, 'getMediaContent');
  }

  async listMediaContents(page = 1, perPage = 20): Promise<{
    items: CatenoidMediaContentResponse[];
    total: number;
  }> {
    this.logger.log(`Listing media contents: page=${page}`);

    const params = new URLSearchParams({
      service_account_key: this.serviceAccountKey,
      page: String(page),
      per_page: String(perPage),
    });

    const response = await fetch(
      `${this.baseUrl}/0/media_contents?${params}`,
      {
        method: 'GET',
        headers: this.buildHeaders(),
      },
    );

    return this.handleResponse(response, 'listMediaContents');
  }

  // ─── Helpers ────────────────────────────────────────

  private buildHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiAccessToken}`,
    };
  }

  private async handleResponse<T>(response: Response, operation: string): Promise<T> {
    if (!response.ok) {
      const errorBody = await response.text();
      this.logger.error(
        `Catenoid API error [${operation}]: ${response.status} ${errorBody}`,
      );
      throw new Error(
        `Catenoid API error [${operation}]: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as T;
    this.logger.debug(`Catenoid API success [${operation}]`);
    return data;
  }
}
