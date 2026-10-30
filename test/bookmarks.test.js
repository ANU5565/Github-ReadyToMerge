import test from 'node:test';
import assert from 'node:assert/strict';
import { formatBookmark, normalizeUrl, parseBookmarks } from '../src/components/bookmarks.ts';

test('normalizes URLs with and without https:// to the same value', () => {
  assert.equal(normalizeUrl('example.com'), normalizeUrl('https://example.com'));
});

test('recovers from empty, corrupted, legacy, and non-array storage values', () => {
  assert.deepEqual(parseBookmarks(null), []);
  assert.deepEqual(parseBookmarks(''), []);
  assert.deepEqual(parseBookmarks('{broken json'), []);
  assert.deepEqual(parseBookmarks(JSON.stringify({ url: 'https://example.com', slug: 'mona-old' })), []);
  assert.deepEqual(parseBookmarks(JSON.stringify(['legacy string'])), []);
  assert.deepEqual(parseBookmarks(JSON.stringify([
    { url: 'https://example.com', slug: 'mona-valid' },
    { url: 'https://example.org', slug: 42 },
    { url: '', slug: 'mona-empty' },
    null,
  ])), [{ url: 'https://example.com', slug: 'mona-valid' }]);
});

test('formats a saved bookmark with the exact separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' }),
    'https://www.example.com :: mona-7fk2',
  );
});
