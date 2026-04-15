import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { CatenoidService } from './catenoid.service.js';
import { ConfigService } from '@nestjs/config';

function createMockConfig(): ConfigService {
  const values: Record<string, string> = {
    'catenoid.apiBaseUrl': 'https://api.kollus.com',
    'catenoid.serviceAccountKey': 'test-account-key',
    'catenoid.apiAccessToken': 'test-access-token',
  };
  return {
    get: (key: string) => values[key],
  } as unknown as ConfigService;
}

describe('CatenoidService', () => {
  let service: CatenoidService;

  beforeEach(() => {
    service = new CatenoidService(createMockConfig());
  });

  describe('createLiveChannel', () => {
    it('should call Catenoid API to create a channel', async () => {
      const mockResponse = {
        key: 'ch-123',
        name: 'Test Channel',
        rtmp_url: 'rtmp://live.kollus.com/live',
        stream_key: 'stream-key-abc',
        status: 'active',
      };

      const originalFetch = globalThis.fetch;
      globalThis.fetch = mock.fn(async () =>
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ) as unknown as typeof fetch;

      try {
        const result = await service.createLiveChannel('Test Channel');
        assert.equal(result.key, 'ch-123');
        assert.equal(result.rtmp_url, 'rtmp://live.kollus.com/live');
        assert.equal(result.stream_key, 'stream-key-abc');
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it('should throw on API error', async () => {
      const originalFetch = globalThis.fetch;
      globalThis.fetch = mock.fn(async () =>
        new Response('Unauthorized', { status: 401 }),
      ) as unknown as typeof fetch;

      try {
        await assert.rejects(
          () => service.createLiveChannel('Fail Channel'),
          (err: Error) => {
            assert.match(err.message, /Catenoid API error/);
            return true;
          },
        );
      } finally {
        globalThis.fetch = originalFetch;
      }
    });
  });

  describe('getUploadToken', () => {
    it('should return upload URL and token', async () => {
      const mockResponse = {
        upload_url: 'https://upload.kollus.com/upload',
        upload_token: 'tok-xyz',
        progress_url: 'https://upload.kollus.com/progress/tok-xyz',
      };

      const originalFetch = globalThis.fetch;
      globalThis.fetch = mock.fn(async () =>
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ) as unknown as typeof fetch;

      try {
        const result = await service.getUploadToken('Lecture 1');
        assert.equal(result.upload_url, 'https://upload.kollus.com/upload');
        assert.equal(result.upload_token, 'tok-xyz');
      } finally {
        globalThis.fetch = originalFetch;
      }
    });
  });

  describe('getLiveChannel', () => {
    it('should fetch channel details by key', async () => {
      const mockResponse = {
        key: 'ch-456',
        name: 'Live Math',
        rtmp_url: 'rtmp://live.kollus.com/live',
        stream_key: 'sk-456',
        status: 'active',
      };

      const originalFetch = globalThis.fetch;
      globalThis.fetch = mock.fn(async () =>
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ) as unknown as typeof fetch;

      try {
        const result = await service.getLiveChannel('ch-456');
        assert.equal(result.key, 'ch-456');
        assert.equal(result.name, 'Live Math');
      } finally {
        globalThis.fetch = originalFetch;
      }
    });
  });
});
