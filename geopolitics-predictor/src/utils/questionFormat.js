const CATEGORY_ICONS = {
  'east asia': '🌏',
  'middle east': '🛢️',
  europe: '🇪🇺',
  'cyber/global': '💻',
  geopolitics: '🌍',
  elections: '🗳️',
  war: '⚔️',
  economy: '📈',
  technology: '🤖',
  energy: '⚡',
};

export function getCategoryIcon(category) {
  const key = String(category || '').toLowerCase();
  return CATEGORY_ICONS[key] || '🌐';
}

export function formatCategoryLabel(category) {
  const raw = String(category || '').trim();
  if (!raw) return 'Unknown';

  return raw
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function getCurrentProb(question) {
  const history = question?.history || [];
  const last = history[history.length - 1];
  const value = Number(last?.probability ?? 0);
  return Math.round(value);
}

export function get24hChange(question) {
  const history = question?.history || [];
  if (history.length < 2) return 0;

  const now = Number(history[history.length - 1]?.probability ?? 0);
  const idx = Math.max(0, history.length - 8);
  const prev = Number(history[idx]?.probability ?? now);

  return Math.round((now - prev) * 10) / 10;
}

export function getLastUpdated(question) {
  const history = question?.history || [];
  const last = history[history.length - 1];
  const source = question?.lastUpdated || last?.date;
  const timestamp = Date.parse(source || '') || last?.timestamp || Date.now();
  const diff = Date.now() - timestamp;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}
