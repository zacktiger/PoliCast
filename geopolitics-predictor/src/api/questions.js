const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function toPercent(value) {
  const num = Number(value ?? 0);
  return Math.round(num * 1000) / 10;
}

function normalizeSummary(question) {
  const timestamp = Date.parse(question.last_updated || '') || Date.now();
  const probability = toPercent(question.current_probability);

  return {
    id: String(question.id),
    title: question.title,
    category: question.category,
    lastUpdated: question.last_updated,
    history: [
      {
        timestamp: timestamp - 4 * 60 * 60 * 1000,
        date: question.last_updated,
        probability,
      },
      {
        timestamp,
        date: question.last_updated,
        probability,
      },
    ],
    drivers: [],
    resolution: 'N/A',
    aiConfidence: null,
  };
}

function normalizeDetail(question) {
  const base = normalizeSummary(question);

  const history = (question.probability_history || [])
    .map((row) => {
      const timestamp = Date.parse(row.recorded_at || '') || Date.now();
      return {
        timestamp,
        date: row.recorded_at,
        probability: toPercent(row.probability),
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);

  const drivers = (question.signal_drivers || []).map((driver) => ({
    text: driver.reason,
    impact: Number(driver.impact) >= 0 ? 'up' : 'down',
  }));

  return {
    ...base,
    history: history.length > 0 ? history : base.history,
    drivers,
    isResolved: question.is_resolved,
  };
}

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchQuestions() {
  const data = await request('/questions');
  return data.map(normalizeSummary);
}

export async function fetchQuestionDetail(questionId) {
  const data = await request(`/questions/${questionId}`);
  return normalizeDetail(data);
}
