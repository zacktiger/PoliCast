// Prediction market questions data
// Each question has historical probability data points simulating model updates every ~3-4 hours

function generateHistory(baseProb, volatility, days = 30) {
  const points = [];
  let prob = baseProb - volatility * 2 + Math.random() * volatility;
  const now = Date.now();
  const interval = 3.5 * 60 * 60 * 1000; // ~3.5 hours in ms
  const totalPoints = Math.floor((days * 24) / 3.5);

  for (let i = totalPoints; i >= 0; i--) {
    const timestamp = now - i * interval;
    prob += (Math.random() - 0.48) * volatility * 0.3;
    prob = Math.max(2, Math.min(98, prob));
    points.push({
      timestamp,
      date: new Date(timestamp).toISOString(),
      probability: Math.round(prob * 10) / 10,
    });
  }

  // Make the last point the "current" probability
  return points;
}

export const categories = [
  { id: 'all', label: 'All Markets', icon: '🌐' },
  { id: 'geopolitics', label: 'Geopolitics', icon: '🌍' },
  { id: 'elections', label: 'Elections', icon: '🗳️' },
  { id: 'war', label: 'War & Conflict', icon: '⚔️' },
  { id: 'economy', label: 'Economy', icon: '📈' },
  { id: 'technology', label: 'Technology', icon: '🤖' },
  { id: 'energy', label: 'Energy', icon: '⚡' },
];

export const questions = [
  {
    id: 1,
    title: 'Will China invade Taiwan before 2030?',
    category: 'geopolitics',
    history: generateHistory(34, 8),
    drivers: [
      { text: 'Chinese naval drills intensifying near Taiwan Strait', impact: 'up' },
      { text: 'Taiwan election tensions rising', impact: 'up' },
      { text: 'US military exercises in Pacific increased', impact: 'up' },
      { text: 'Diplomatic back-channels remain active', impact: 'down' },
    ],
    aiConfidence: 72,
    resolution: 'Dec 31, 2029',
  },
  {
    id: 2,
    title: 'US forces enter Iran before 2027?',
    category: 'war',
    history: generateHistory(38, 12),
    drivers: [
      { text: 'Escalating rhetoric from US officials', impact: 'up' },
      { text: 'Iran enrichment levels near weapons-grade', impact: 'up' },
      { text: 'Gulf allies pushing for diplomatic solution', impact: 'down' },
      { text: 'US public opinion strongly against ground war', impact: 'down' },
    ],
    aiConfidence: 65,
    resolution: 'Dec 31, 2026',
  },
  {
    id: 3,
    title: 'Will India become the 3rd largest economy by 2027?',
    category: 'economy',
    history: generateHistory(71, 6),
    drivers: [
      { text: 'GDP growth rate consistently above 6%', impact: 'up' },
      { text: 'Manufacturing sector expanding rapidly', impact: 'up' },
      { text: 'Japan GDP stagnation continues', impact: 'up' },
      { text: 'Rupee depreciation could slow nominal GDP gains', impact: 'down' },
    ],
    aiConfidence: 85,
    resolution: 'Dec 31, 2027',
  },
  {
    id: 4,
    title: 'Will AGI be achieved before 2030?',
    category: 'technology',
    history: generateHistory(22, 10),
    drivers: [
      { text: 'Rapid progress in foundation models', impact: 'up' },
      { text: 'Major labs increasing compute investments', impact: 'up' },
      { text: 'No consensus on AGI definition', impact: 'down' },
      { text: 'Scaling laws showing diminishing returns', impact: 'down' },
    ],
    aiConfidence: 58,
    resolution: 'Dec 31, 2029',
  },
  {
    id: 5,
    title: 'Will Russia-Ukraine war end by 2026?',
    category: 'war',
    history: generateHistory(28, 14),
    drivers: [
      { text: 'Ceasefire negotiations stalled', impact: 'down' },
      { text: 'Ukraine spring offensive underway', impact: 'down' },
      { text: 'Russia economy under severe strain', impact: 'up' },
      { text: 'US pressuring for peace deal', impact: 'up' },
    ],
    aiConfidence: 61,
    resolution: 'Dec 31, 2026',
  },
  {
    id: 6,
    title: 'Will oil prices exceed $120/barrel in 2026?',
    category: 'energy',
    history: generateHistory(33, 11),
    drivers: [
      { text: 'OPEC+ production cuts extended', impact: 'up' },
      { text: 'Middle East instability disrupting supply', impact: 'up' },
      { text: 'Global demand slowing due to recession fears', impact: 'down' },
      { text: 'US shale production at record highs', impact: 'down' },
    ],
    aiConfidence: 68,
    resolution: 'Dec 31, 2026',
  },
  {
    id: 7,
    title: 'Will a Republican win the 2028 US Presidential Election?',
    category: 'elections',
    history: generateHistory(52, 9),
    drivers: [
      { text: 'Republican primary field consolidating', impact: 'up' },
      { text: 'Economy remains a key voter concern', impact: 'up' },
      { text: 'Democratic incumbent advantage', impact: 'down' },
      { text: 'Youth voter registration surging', impact: 'down' },
    ],
    aiConfidence: 55,
    resolution: 'Nov 5, 2028',
  },
  {
    id: 8,
    title: 'Will the EU impose carbon border tax by 2027?',
    category: 'economy',
    history: generateHistory(78, 5),
    drivers: [
      { text: 'CBAM legislation already in transition phase', impact: 'up' },
      { text: 'Strong support from major EU economies', impact: 'up' },
      { text: 'Industry lobbying for delays', impact: 'down' },
      { text: 'WTO legal challenges pending', impact: 'down' },
    ],
    aiConfidence: 88,
    resolution: 'Dec 31, 2027',
  },
  {
    id: 9,
    title: 'Will North Korea conduct a nuclear test in 2026?',
    category: 'geopolitics',
    history: generateHistory(41, 13),
    drivers: [
      { text: 'Satellite imagery shows tunnel activity at test site', impact: 'up' },
      { text: 'Kim Jong-un escalating rhetoric', impact: 'up' },
      { text: 'China signaling disapproval of tests', impact: 'down' },
      { text: 'Diplomatic engagement attempts by South Korea', impact: 'down' },
    ],
    aiConfidence: 63,
    resolution: 'Dec 31, 2026',
  },
  {
    id: 10,
    title: 'Will global temperatures breach 1.5°C threshold permanently?',
    category: 'energy',
    history: generateHistory(62, 7),
    drivers: [
      { text: '2025 was hottest year on record', impact: 'up' },
      { text: 'El Niño pattern strengthening', impact: 'up' },
      { text: 'Renewable energy deployment accelerating', impact: 'down' },
      { text: 'Methane reduction pledges showing results', impact: 'down' },
    ],
    aiConfidence: 76,
    resolution: 'Dec 31, 2030',
  },
  {
    id: 11,
    title: 'Will Modi win the 2029 Indian General Election?',
    category: 'elections',
    history: generateHistory(58, 10),
    drivers: [
      { text: 'BJP organizational strength remains dominant', impact: 'up' },
      { text: 'Economic growth boosting incumbency', impact: 'up' },
      { text: 'Opposition alliance gaining traction', impact: 'down' },
      { text: 'Anti-incumbency in key states', impact: 'down' },
    ],
    aiConfidence: 70,
    resolution: 'May 31, 2029',
  },
  {
    id: 12,
    title: 'Will semiconductor supply chains fully decouple from China by 2028?',
    category: 'technology',
    history: generateHistory(29, 8),
    drivers: [
      { text: 'CHIPS Act funding driving US manufacturing', impact: 'up' },
      { text: 'EU and Japan investing in domestic fabs', impact: 'up' },
      { text: 'Legacy chip dependency remains deep', impact: 'down' },
      { text: 'Full decoupling economically impractical', impact: 'down' },
    ],
    aiConfidence: 52,
    resolution: 'Dec 31, 2028',
  },
  {
    id: 13,
    title: 'Will NATO expand to include a new member by 2027?',
    category: 'geopolitics',
    history: generateHistory(45, 9),
    drivers: [
      { text: 'Georgia and Ukraine pressing for membership', impact: 'up' },
      { text: 'Security concerns driving alliance solidarity', impact: 'up' },
      { text: 'Hungary and Turkey blocking consensus', impact: 'down' },
      { text: 'War in Ukraine complicating expansion', impact: 'down' },
    ],
    aiConfidence: 60,
    resolution: 'Dec 31, 2027',
  },
  {
    id: 14,
    title: 'Will Bitcoin exceed $200K before 2027?',
    category: 'economy',
    history: generateHistory(35, 15),
    drivers: [
      { text: 'Institutional adoption accelerating with ETFs', impact: 'up' },
      { text: 'Halving cycle historically bullish', impact: 'up' },
      { text: 'Regulatory crackdowns in key markets', impact: 'down' },
      { text: 'Macro environment uncertain', impact: 'down' },
    ],
    aiConfidence: 48,
    resolution: 'Dec 31, 2026',
  },
  {
    id: 15,
    title: 'Will a major cyberattack disrupt a national power grid in 2026?',
    category: 'technology',
    history: generateHistory(27, 10),
    drivers: [
      { text: 'State-sponsored cyber threats increasing', impact: 'up' },
      { text: 'Critical infrastructure vulnerabilities exposed', impact: 'up' },
      { text: 'Cybersecurity spending at all-time high', impact: 'down' },
      { text: 'International cyber norms gaining traction', impact: 'down' },
    ],
    aiConfidence: 55,
    resolution: 'Dec 31, 2026',
  },
];

// Get the current probability (last data point)
export function getCurrentProb(question) {
  const last = question.history[question.history.length - 1];
  return Math.round(last.probability);
}

// Get the probability change in the last 24h
export function get24hChange(question) {
  const history = question.history;
  const now = history[history.length - 1].probability;
  // ~7 data points back = ~24h worth of 3.5h intervals
  const idx = Math.max(0, history.length - 8);
  const prev = history[idx].probability;
  return Math.round((now - prev) * 10) / 10;
}

// Get last updated time as a human-readable string
export function getLastUpdated(question) {
  const last = question.history[question.history.length - 1];
  const diff = Date.now() - last.timestamp;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}
