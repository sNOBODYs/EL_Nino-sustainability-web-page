export const EMISSION_CATEGORIES = [
  {
    id: 'transport',
    number: '01',
    name: 'Transport',
    shortDescription: 'Train, car, walking and cycling',
    explanation: 'Travel and transport associated with company operations.',
    metrics: [
      { id: 'train', label: 'Train', detail: 'Train journeys and rail-related emissions.' },
      { id: 'car', label: 'Car', detail: 'Road travel and associated vehicle emissions.' },
      { id: 'Walking/Cycling', label: 'Walking/Cycling', detail: 'Emissions from walking and cycling activities.' },
    ],
  },
  {
    id: 'digital',
    number: '02',
    name: 'Digital Systems',
    shortDescription: 'AI, servers and cloud',
    explanation: 'Compute and infrastructure used to develop and run digital products.',
    metrics: [
      { id: 'ai', label: 'AI', detail: 'Emissions assigned to AI training or inference.' },
      { id: 'servers', label: 'Servers', detail: 'Emissions assigned to server infrastructure.' },
      { id: 'cloud', label: 'Cloud', detail: 'Emissions assigned to cloud resources.' },
    ],
  },
  {
    id: 'offices',
    number: '03',
    name: 'Offices',
    shortDescription: 'Enschede, The Hague and laptops',
    explanation: 'Building operations and emissions from purchased laptops.',
    metrics: [
      { id: 'enschede', label: 'Enschede', detail: 'Emissions from the Enschede office.' },
      { id: 'the-hague', label: 'The Hague', detail: 'Emissions from the The Hague office.' },
      { id: 'bought-laptops', label: 'Bought Laptops', detail: 'Embodied emissions attributed to purchased laptops.' },
    ],
  },
];

// ILLUSTRATIVE VALUES ONLY: not actual El Niño emissions.
// The shape is the same as the JSON expected from the backend endpoint.
export const DEMO_EMISSIONS = {
  year: 2026,
  unit: 'kg CO₂e',
  categories: {
    transport: { train: 240, car: 620, 'Walking/Cycling': 18 },
    digital: { ai: 410, servers: 950, cloud: 680 },
    offices: { enschede: 830, 'the-hague': 520, 'bought-laptops': 410 },
  },
};

/**
 * Validate/normalize a backend response. Missing readings remain null (unknown),
 * NOT zero. This avoids showing missing calculations as zero emissions.
 */
export function normalizeEmissions(input, year) {
  if (!input || typeof input !== 'object' || !input.categories || typeof input.categories !== 'object') {
    throw new Error('Invalid emissions API response: expected a categories object.');
  }

  const categories = {};
  for (const category of EMISSION_CATEGORIES) {
    const source = input.categories[category.id];
    categories[category.id] = {};
    for (const metric of category.metrics) {
      const raw = source && typeof source === 'object' ? source[metric.id] : null;
      categories[category.id][metric.id] =
        typeof raw === 'number' && Number.isFinite(raw) && raw >= 0 ? raw : null;
    }
  }

  return {
    year: typeof input.year === 'number' ? input.year : year,
    unit: 'kg CO₂e',
    categories,
  };
}

/**
 * With no VITE_EMISSIONS_API_URL: use demo data with NO network request.
 * Later configure VITE_EMISSIONS_API_URL=/api/emissions to enable the live API.
 *
 * The browser never accesses SQL: only a server endpoint that queries SQL.
 */
export async function loadEmissions(year, signal) {
  const configuredEndpoint = import.meta.env.VITE_EMISSIONS_API_URL?.trim();
  if (!configuredEndpoint) {
    return { report: { ...DEMO_EMISSIONS, year }, source: 'demo' };
  }

  const url = new URL(configuredEndpoint, window.location.origin);
  url.searchParams.set('year', String(year));

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Emissions API returned HTTP ${response.status}.`);
  }

  const json = await response.json();
  return { report: normalizeEmissions(json, year), source: 'live' };
}
