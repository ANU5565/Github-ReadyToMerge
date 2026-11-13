export const STORAGE_KEY = 'mona-bookmarks';
const COUNTER_KEY = 'mona-bookmarks-counter';
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function normalizeUrl(value) {
  const input = value.trim();
  if (!input) return null;
  const candidate = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(input) ? input : `https://${input}`;

  try {
    return new URL(candidate).href;
  } catch {
    return null;
  }
}

export function formatBookmark(bookmark) {
  return `${bookmark.url} :: ${bookmark.slug}`;
}

export function parseBookmarks(rawValue) {
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => {
      if (!item || typeof item !== 'object') return false;
      return typeof item.url === 'string' && typeof item.slug === 'string';
    });
  } catch {
    return [];
  }
}

function toBase62(value) {
  let current = Math.max(0, Math.floor(value));
  if (current === 0) return '0';

  let encoded = '';
  while (current > 0) {
    encoded = BASE62[current % 62] + encoded;
    current = Math.floor(current / 62);
  }
  return encoded;
}

function parseCounter(rawValue) {
  const parsed = Number.parseInt(rawValue ?? '0', 10);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return parsed;
}

export function createSlug(storage) {
  const next = parseCounter(storage.getItem(COUNTER_KEY)) + 1;
  storage.setItem(COUNTER_KEY, String(next));
  return `mona-${toBase62(next)}`;
}

export function loadBookmarks(storage) {
  return parseBookmarks(storage.getItem(STORAGE_KEY));
}

export function saveBookmarks(storage, bookmarks) {
  storage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}
