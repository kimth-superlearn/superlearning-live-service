import { createHmac } from 'node:crypto';

interface KollusJwtPayload {
  cuid: string; // client user id
  expt: number; // expiration timestamp
  mc: Array<{
    mckey: string; // media content key
    mcpf?: string; // media content profile key
    title?: string;
  }>;
  awtc?: {
    // access token control
    mul?: number; // max user limit
    mrd?: number; // max resolution download
    pcc?: boolean; // play count check
  };
}

/**
 * Generates a Kollus-compatible JWT for secure video playback.
 * Uses HMAC-SHA256 signing with the Catenoid security key.
 */
export function generateKollusPlayToken(
  securityKey: string,
  options: {
    userId: string;
    mediaContentKeys: string[];
    expiresInSeconds?: number;
    maxUserLimit?: number;
  },
): string {
  const now = Math.floor(Date.now() / 1000);
  const expt = now + (options.expiresInSeconds ?? 7200);

  const payload: KollusJwtPayload = {
    cuid: options.userId,
    expt,
    mc: options.mediaContentKeys.map((mckey) => ({ mckey })),
  };

  if (options.maxUserLimit) {
    payload.awtc = { mul: options.maxUserLimit };
  }

  const header = base64urlEncode(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
  const body = base64urlEncode(JSON.stringify(payload));
  const signature = createHmac('sha256', securityKey)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

function base64urlEncode(str: string): string {
  return Buffer.from(str, 'utf-8').toString('base64url');
}
