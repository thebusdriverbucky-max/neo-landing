import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BookingInputError,
  escapeHtml,
  parseBookingInput,
} from '../lib/booking-input';
import {
  MAX_UPLOAD_BYTES,
  UploadPolicyError,
  assertAllowedImage,
} from '../lib/upload-policy';
import { getClientIp } from '../lib/rate-limit';

test('normalizes and validates booking input', () => {
  assert.deepEqual(parseBookingInput({
    name: '  Jane Doe  ',
    phone: ' +1 (234) 567-8901 ',
    email: ' JANE@EXAMPLE.COM ',
    date: '2028-02-29',
    message: '  Hello  ',
  }), {
    name: 'Jane Doe',
    phone: '+1 (234) 567-8901',
    email: 'jane@example.com',
    date: '2028-02-29',
    message: 'Hello',
  });
});

test('rejects malformed booking values', () => {
  const valid = { name: 'Jane', phone: '+1 234 567 8901' };
  assert.throws(() => parseBookingInput({ ...valid, email: 'not-an-email' }), BookingInputError);
  assert.throws(() => parseBookingInput({ ...valid, phone: 'call me' }), BookingInputError);
  assert.throws(() => parseBookingInput({ ...valid, date: '2027-02-29' }), BookingInputError);
  assert.throws(() => parseBookingInput({ ...valid, message: 42 }), BookingInputError);
});

test('escapes user-controlled HTML and attributes', () => {
  assert.equal(
    escapeHtml(`<a href="x">Tom & Jerry's</a>`),
    '&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&#39;s&lt;/a&gt;',
  );
});

test('allows only bounded raster image uploads', () => {
  assert.doesNotThrow(() => assertAllowedImage({ size: MAX_UPLOAD_BYTES, type: 'image/webp' }));
  assert.throws(
    () => assertAllowedImage({ size: MAX_UPLOAD_BYTES + 1, type: 'image/jpeg' }),
    (error) => error instanceof UploadPolicyError && error.status === 413,
  );
  assert.throws(
    () => assertAllowedImage({ size: 100, type: 'image/svg+xml' }),
    (error) => error instanceof UploadPolicyError && error.status === 400,
  );
});

test('uses only the Vercel-managed client IP for rate-limit identity', () => {
  const request = new Request('https://example.test', {
    headers: {
      'x-vercel-forwarded-for': '2001:db8::10, 203.0.113.12',
      'x-forwarded-for': '203.0.113.13',
      'x-real-ip': '203.0.113.14',
    },
  });
  assert.equal(getClientIp(request), '2001:db8::10');
  assert.equal(getClientIp(new Request('https://example.test', {
    headers: { 'x-forwarded-for': '203.0.113.13' },
  })), 'anonymous');
});
