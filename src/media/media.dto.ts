import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLiveChannelDto {
  @ApiProperty({ example: 'Math Class Live' })
  name!: string;
}

export class RequestUploadTokenDto {
  @ApiProperty({ example: 'Lecture 01 - Introduction' })
  title!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  categoryKey?: string;
}

export class TranscodeCallbackDto {
  @ApiProperty({ description: 'Catenoid media content key' })
  media_content_key!: string;

  @ApiProperty({ description: 'Transcoding status' })
  status!: string;

  @ApiPropertyOptional()
  duration?: number;

  @ApiPropertyOptional()
  thumbnail_url?: string;
}

export class PlayTokenRequestDto {
  @ApiProperty({ description: 'Media content ID in local DB' })
  videoContentId!: number;
}
