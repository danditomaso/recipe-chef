import { expect, test } from 'vitest';
import { validateUrl } from './validations';

const messages = {
  error: {
    INVALID_URL: 'Invalid URL format',
    UNSUPPORTED_DOMAIN: 'Unsupported domain'
  }
};

test('validateUrl should return valid result for supported URL', async () => {
  const url = 'https://example.com/path/to/resource';
  const result = validateUrl(url);

  expect(result.ok === true);
  expect(result.ok && result.value === url);
});

test('validateUrl should return error for invalid URL format', async () => {
  const invalidUrl = 'invalid-url';
  const result = validateUrl(invalidUrl);

  expect(result.ok === false);
  expect(result.ok === false && result.error.message === messages.error.INVALID_URL);
});

test('validateUrl should return error for unsupported domain', async () => {
  const unsupportedUrl = 'https://unsupported-domain.com';
  const result = validateUrl(unsupportedUrl);

  expect(result.ok === false);
  expect(result.ok === false && result.error.message === messages.error.UNSUPPORTED_DOMAIN);
});
