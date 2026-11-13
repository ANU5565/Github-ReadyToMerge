import test from 'node:test';
import assert from 'node:assert/strict';

import { formatBookmark, normalizeUrl, parseBookmarks } from './bookmark-helpers.js';

test('normalizeUrl saves with and without https:// the same way', () => {
  assert.equal(normalizeUrl('example.com'), normalizeUrl('https://example.com'));
});

test('parseBookmarks recovers from malformed storage values', () => {
  assert.deepEqual(parseBookmarks(null), []);
  assert.deepEqual(parseBookmarks(''), []);
  assert.deepEqual(parseBookmarks('{'), []);
  assert.deepEqual(parseBookmarks('"legacy-value"'), []);
  assert.deepEqual(parseBookmarks('{"url":"https://example.com","slug":"mona-1"}'), []);
  assert.deepEqual(parseBookmarks('[1,true,{"url":"https://example.com"}]'), []);
});

test('formatBookmark uses exact visible separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com/', slug: 'mona-7fk2' }),
    'https://www.example.com/ :: mona-7fk2',
  );
});
