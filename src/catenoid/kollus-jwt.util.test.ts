import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { generateKollusPlayToken } from './kollus-jwt.util.js';

interface JwtHeader {
  typ: string;
  alg: string;
}

interface KollusPayload {
  cuid: string;
  expt: number;
  mc: Array<{ mckey: string }>;
  awtc?: { mul: number };
}

void describe('generateKollusPlayToken', () => {
  const securityKey = 'test-security-key-12345';

  void it('should generate a valid JWT with 3 parts', () => {
    const token = generateKollusPlayToken(securityKey, {
      userId: 'user-1',
      mediaContentKeys: ['mc-key-abc'],
    });

    const parts = token.split('.');
    assert.equal(parts.length, 3, 'JWT must have 3 parts');
  });

  void it('should contain correct header', () => {
    const token = generateKollusPlayToken(securityKey, {
      userId: 'user-1',
      mediaContentKeys: ['mc-key-abc'],
    });

    const [headerB64] = token.split('.');
    const header = JSON.parse(
      Buffer.from(headerB64, 'base64url').toString(),
    ) as JwtHeader;
    assert.equal(header.typ, 'JWT');
    assert.equal(header.alg, 'HS256');
  });

  void it('should contain correct payload fields', () => {
    const token = generateKollusPlayToken(securityKey, {
      userId: 'user-42',
      mediaContentKeys: ['key-1', 'key-2'],
      expiresInSeconds: 3600,
    });

    const [, payloadB64] = token.split('.');
    const payload = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString(),
    ) as KollusPayload;

    assert.equal(payload.cuid, 'user-42');
    assert.equal(payload.mc.length, 2);
    assert.equal(payload.mc[0].mckey, 'key-1');
    assert.equal(payload.mc[1].mckey, 'key-2');
    assert.ok(payload.expt > Math.floor(Date.now() / 1000));
  });

  void it('should produce a valid HMAC-SHA256 signature', () => {
    const token = generateKollusPlayToken(securityKey, {
      userId: 'user-1',
      mediaContentKeys: ['mc-key'],
    });

    const [header, payload, signature] = token.split('.');
    const expectedSig = createHmac('sha256', securityKey)
      .update(`${header}.${payload}`)
      .digest('base64url');

    assert.equal(signature, expectedSig);
  });

  void it('should include awtc when maxUserLimit is set', () => {
    const token = generateKollusPlayToken(securityKey, {
      userId: 'user-1',
      mediaContentKeys: ['mc-key'],
      maxUserLimit: 3,
    });

    const [, payloadB64] = token.split('.');
    const payload = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString(),
    ) as KollusPayload;

    assert.deepEqual(payload.awtc, { mul: 3 });
  });
});
