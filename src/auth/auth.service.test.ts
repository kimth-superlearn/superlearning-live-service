import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as argon2 from 'argon2';

describe('AuthService - argon2 hashing', () => {
  it('should hash and verify a password correctly', async () => {
    const password = 'testPassword123!';
    const hash = await argon2.hash(password);

    assert.notEqual(hash, password);
    assert.ok(hash.startsWith('$argon2'));

    const isValid = await argon2.verify(hash, password);
    assert.equal(isValid, true);
  });

  it('should reject an incorrect password', async () => {
    const password = 'correctPassword';
    const hash = await argon2.hash(password);

    const isValid = await argon2.verify(hash, 'wrongPassword');
    assert.equal(isValid, false);
  });

  it('should produce different hashes for the same password (salting)', async () => {
    const password = 'samePassword';
    const hash1 = await argon2.hash(password);
    const hash2 = await argon2.hash(password);

    assert.notEqual(hash1, hash2);
  });
});
