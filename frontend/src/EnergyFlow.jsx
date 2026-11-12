import { useEffect, useMemo, useState } from 'react';
import { DEMO_EMISSIONS, EMISSION_CATEGORIES, loadEmissions } from './emissionsData';
import './EnergyFlow.css';

const numberFormat = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 1 });
const YEAR = Number(import.meta.env.VITE_REPORTING_YEAR) || 2026;
const COMPARISONS_MODE = import.meta.env.VITE_COMPARISONS_MODE === 'api' ? 'api' : 'demo';
const COMPARISONS_API_URL = import.meta.env.VITE_COMPARISONS_API_URL?.trim();


function formatNumber(number) {
  return number == null ? '—' : numberFormat.format(number);
}

function niceCeiling(maximum) {
  if (maximum <= 0) return 100;
  const power = 10 ** Math.floor(Math.log10(maximum));
  const normalized = maximum / power;
  const multiplier = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return multiplier * power;
}

function CategoryButton({ category, active, measuredTotal, onSelect }) {
  return (
    <button
      type="button"
      role="tab"
      id={`ef-tab-${category.id}`}
      aria-controls="ef-panel"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      className={`ef-choice ${active ? 'ef-choice--active' : ''}`}
      onClick={() => onSelect(category.id)}
    >
      <span className="ef-choice-index">{category.number}</span>
      <span className="ef-choice-copy">
        <strong>{category.name}</strong>
        <small>{category.shortDescription}</small>
      </span>
      <span className="ef-choice-end">
        <span className="ef-choice-number">{formatNumber(measuredTotal)}</span>
        <span className="ef-choice-unit">kg CO₂e</span>
      </span>
      <span className="ef-choice-arrow" aria-hidden="true">↗</span>
    </button>
  );
}

function sumMetrics(values) {
  return Object.values(values).reduce((total, value) => total + (value ?? 0), 0);
}

function AnimatedBarChart({ category, values, year }) {
  const readings = category.metrics.map((metric) => ({ ...metric, value: values[metric.id] }));
  const maxValue = Math.max(0, ...readings.map((reading) => reading.value ?? 0));
  const scaleMax = niceCeiling(maxValue);
  const ticks = [1, .75, .5, .25, 0].map((fraction) => fraction * scaleMax);

  return (
    <div className="ef-chart" aria-label={`${category.name} emissions in ${year}, kilograms of CO2 equivalent`}>
      <div className="ef-chart-unit">kg CO₂e</div>
      <div className="ef-chart-axes">
        <div className="ef-y-axis" aria-hidden="true">
          {ticks.map((tick, index) => <span key={index}>{formatNumber(tick)}</span>)}
        </div>
        <div className="ef-chart-plot">
          <div className="ef-chart-grid" aria-hidden="true">
            {ticks.map((tick, index) => <span key={index} />)}
          </div>
          <div className="ef-chart-columns">
            {readings.map((reading, index) => {
              const percent = reading.value == null ? 0 : (reading.value / scaleMax) * 100;
              return (
                <div className="ef-chart-column" key={index} title={`${reading.label}: ${formatNumber(reading.value)} kg CO₂e`}>
                  <span className="ef-bar-value" style={{ bottom: `calc(${percent}% + 9px)` }}>
                    {formatNumber(reading.value)}
                  </span>
                  <div
                    className={`ef-bar ef-bar--${index + 1}${reading.value == null ? ' ef-bar--missing' : ''}`}
                    style={{ height: `${percent}%` }}
                    aria-hidden="true"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="ef-chart-labels" aria-hidden="true">
        {readings.map((reading, index) => <span key={index}>{reading.label}</span>)}
      </div>
      <div className="ef-sr-only" aria-live="polite" aria-atomic="true">
        {category.name}, {year}: {readings.map((reading) => `${reading.label}: ${formatNumber(reading.value)} kg CO₂e`).join('; ')}.
      </div>
    </div>
  );
}

// In API = VITE_COMPARISONS_API_URL.
const DEMO_COMPARISONS = [
  { trees: 78, flights: 13.4, trainTrips: 288, carTrips: 149, homeDays: 480 },
  { trees: 46, flights: 7.8, trainTrips: 162, carTrips: 85, homeDays: 275 },
  { trees: 112, flights: 19.2, trainTrips: 415, carTrips: 210, homeDays: 620 },
];

const COMPARISON_ITEMS = [
  {
    id: 'trees',
    icon: 'tree',
    unit: 'trees',
    title: 'Nature’s clean-up crew',
    detail: 'Mature trees absorbing CO₂ over one year',
    decimals: 0,
  },
  {
    id: 'flights',
    icon: 'plane',
    unit: 'flights',
    title: 'Amsterdam → London',
    detail: 'One-way passenger flights',
    decimals: 1,
  },
  {
    id: 'trainTrips',
    icon: 'train',
    unit: 'rail trips',
    title: 'Amsterdam → Paris',
    detail: 'One-way passenger train journeys',
    decimals: 0,
  },
  {
    id: 'carTrips',
    icon: 'car',
    unit: 'car trips',
    title: 'Amsterdam → Rotterdam',
    detail: 'One-way passenger car journeys',
    decimals: 0,
  },
  {
    id: 'homeDays',
    icon: 'home',
    unit: 'days',
    title: 'A Dutch home’s electricity',
    detail: 'Days of household electricity use',
    decimals: 0,
  },
];

function ComparisonIcon({ name }) {
  const svgProps = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  switch (name) {
    case 'tree':
      return <svg {...svgProps}><path d="M12 22v-7M8 22h8M12 2l-5 7h2l-4 6h14l-4-6h2l-5-7Z" /></svg>;
    case 'plane':
      return <svg {...svgProps}><path d="m22 2-9 20-3.5-8.5L1 10l21-8Z" /><path d="M9.5 13.5 22 2" /></svg>;
    case 'train':
      return <svg {...svgProps}><rect x="5" y="2" width="14" height="17" rx="4" /><path d="M5 10h14M8 22l2-3m6 0 2 3M9 15h.01M15 15h.01M9 6h6" /></svg>;
    case 'car':
      return <svg {...svgProps}><path d="m5 11 2-6h10l2 6M5 17v3m14-3v3M3 11h18v6H3v-6ZM7 14h.01M17 14h.01" /></svg>;
    default:
      return <svg {...svgProps}><path d="m3 10 9-7 9 7v11H3V10Z" /><path d="M9 21v-8h6v8" /></svg>;
  }
}

function formatComparison(value, decimals) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return '—';
  return new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function AnimatedComparisonNumber({ value, decimals, delay }) {
  const isValid = typeof value === 'number' && Number.isFinite(value) && value >= 0;
  const [displayValue, setDisplayValue] = useState(isValid ? 0 : null);

  useEffect(() => {
    if (!isValid) {
      setDisplayValue(null);
      return undefined;
    }

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(value);
      return undefined;
    }

    let frame;
    const start = performance.now();
    const duration = 1050;

    function animate(now) {
      const progress = Math.min(1, Math.max(0, (now - start - delay) / duration));
      const eased = 1 - (1 - progress) ** 4;
      setDisplayValue(value * eased);
      if (progress < 1) frame = requestAnimationFrame(animate);
    }

    setDisplayValue(0);
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, isValid, delay]);
  
  return <span className="ef-comparison-number" aria-hidden="true">{formatComparison(displayValue, decimals)}</span>;
}

function ComparisonStrip({ category, year, values, isPlaceholder, statusLabel }) {
  return (
    <section className="ef-comparisons" aria-labelledby="ef-comparisons-title">
      <div className="ef-comparisons-header">
        <div className="ef-comparisons-heading">
          <span className="ef-comparisons-eyebrow"><span className="ef-comparisons-spark" /> THE IMPACT, IN PERSPECTIVE</span>
          <h3 id="ef-comparisons-title">What does this CO₂ look like?</h3>
          <p>Explore five ways to picture the footprint of <strong>{category.name}</strong>.</p>
        </div>
        <div className="ef-comparisons-status">
          <span className="ef-comparisons-chip">{statusLabel ?? (isPlaceholder ? 'PLACEHOLDER VALUES' : 'BACKEND VALUES')}</span>
          <span className="ef-comparisons-year">{year} <span aria-hidden="true">·</span> Year of reference</span>
        </div>
      </div>

      <div className="ef-comparisons-scroll-hint" aria-hidden="true">Swipe to explore <span>↔</span></div>
      <div className="ef-comparisons-row" tabIndex={0} role="region" aria-label={`CO₂ comparisons for ${category.name}`}>
        {COMPARISON_ITEMS.map((item, index) => (
          <article
            className="ef-comparison-card"
            key={`${category.id}-${item.id}-${isPlaceholder ? 'demo' : 'api'}`}
            style={{ '--ef-card-delay': `${index * 95}ms` }}
          >
            <div className="ef-comparison-card-top">
              <span className="ef-comparison-icon"><ComparisonIcon name={item.icon} /></span>
              <span className="ef-comparison-index">{String(index + 1).padStart(2, '0')} / 05</span>
            </div>
            <div className="ef-comparison-result">
              <AnimatedComparisonNumber
                key={`${category.id}-${item.id}-${isPlaceholder ? 'demo' : 'api'}`}
                value={values?.[item.id]}
                decimals={item.decimals}
                delay={index * 95}
              />
              <span className="ef-comparison-unit" aria-hidden="true">{item.unit}</span>
              <span className="ef-sr-only">{formatComparison(values?.[item.id], item.decimals)} {item.unit}</span>
            </div>
            <h4>{item.title}</h4>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function EnergyFlow() {
  const [activeId, setActiveId] = useState('transport');
  const [report, setReport] = useState(DEMO_EMISSIONS);
  const [source, setSource] = useState('demo');
  const [loadError, setLoadError] = useState(false);
  const [apiComparisons, setApiComparisons] = useState(null);
  const [comparisonsApiStatus, setComparisonsApiStatus] = useState('idle');

  useEffect(() => {
    const controller = new AbortController();
    async function refresh() {
      try {
        const result = await loadEmissions(YEAR, controller.signal);
        if (controller.signal.aborted) return;
        setReport(result.report);
        setSource(result.source);
        setLoadError(false);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('Could not load emissions data:', error);
        setReport({ ...DEMO_EMISSIONS, year: YEAR });
        setSource('demo');
        setLoadError(true);
      }
    }
    refresh();
    return () => controller.abort();
  }, []);

  // Comparison values are fetched separately; this never changes loadEmissions() or the graphs.
  useEffect(() => {
    if (COMPARISONS_MODE !== 'api') return undefined;

    if (!COMPARISONS_API_URL) {
      setComparisonsApiStatus('not-configured');
      return undefined;
    }

    const controller = new AbortController();
    async function loadComparisons() {
      setComparisonsApiStatus('loading');
      try {
        const response = await fetch(COMPARISONS_API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`Comparison API returned HTTP ${response.status}`);
        const payload = await response.json();
        const data = payload?.comparisons ?? payload;
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          throw new Error('Invalid comparison API response');
        }
        if (controller.signal.aborted) return;
        setApiComparisons(data);
        setComparisonsApiStatus('loaded');
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('Could not load comparison data:', error);
        setApiComparisons(null);
        setComparisonsApiStatus('error');
      }
    }
    loadComparisons();
    return () => controller.abort();
  }, []);

  const activeCategory = EMISSION_CATEGORIES.find((category) => category.id === activeId) || EMISSION_CATEGORIES[0];
  const activeValues = report.categories[activeCategory.id];
  const hasMissing = activeCategory.metrics.some((metric) => activeValues[metric.id] == null);
  const hasAny = activeCategory.metrics.some((metric) => activeValues[metric.id] != null);
  const measuredTotal = hasAny ? sumMetrics(activeValues) : null;
  // Comparison values NEVER come from the emissions endpoint.
  // Missing comparison API values are shown as '—', not fake defaults.
  const categoryIndex = EMISSION_CATEGORIES.findIndex((category) => category.id === activeCategory.id);
  const backendComparisons = apiComparisons?.[activeCategory.id];
  const hasBackendComparison = backendComparisons != null &&
    typeof backendComparisons === 'object' && !Array.isArray(backendComparisons);
  const isPlaceholderComparison = COMPARISONS_MODE === 'demo';
  const activeComparisons = isPlaceholderComparison
    ? (DEMO_COMPARISONS[categoryIndex] ?? DEMO_COMPARISONS[0])
    : (hasBackendComparison ? backendComparisons : {});
  const comparisonStatusLabel = isPlaceholderComparison
    ? 'PLACEHOLDER VALUES'
    : hasBackendComparison ? 'BACKEND VALUES'
    : comparisonsApiStatus === 'loading' ? 'LOADING COMPARISONS'
    : comparisonsApiStatus === 'error' ? 'API UNAVAILABLE'
    : comparisonsApiStatus === 'not-configured' ? 'AWAITING API CONFIGURATION'
    : 'AWAITING API VALUES';
    
  const categoryTotals = useMemo(() => Object.fromEntries(
    EMISSION_CATEGORIES.map((category) => {
      const values = report.categories[category.id];
      const hasMeasured = category.metrics.some((metric) => values[metric.id] != null);
      return [category.id, hasMeasured ? sumMetrics(values) : null];
    })
  ), [report]);

  return (
    <section className="ef-section" id="energy-flow" aria-labelledby="ef-heading">
      <div className="ef-inner">
        <span className="ef-sticker">THE LIFECYCLE FLOW</span>
        <div className="ef-heading">
          <h2 id="ef-heading">Where digital energy goes.</h2>
        </div>

        <div className="ef-content">
          <div className="ef-choices" role="tablist" aria-label="Emission calculation groups">
            {EMISSION_CATEGORIES.map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                active={activeId === category.id}
                measuredTotal={categoryTotals[category.id]}
                onSelect={setActiveId}
              />
            ))}
            <p className="ef-choices-note">Explore the three areas from our carbon footprint map. Select one to see how its emissions are distributed. <span aria-hidden="true">↗</span></p>
          </div>

          <div className="ef-chart-card" id="ef-panel" role="tabpanel" aria-labelledby={`ef-tab-${activeId}`} tabIndex={0}>
            <div className="ef-card-header">
              <div className="ef-card-title">
                <span className="ef-data-badge"><span className="ef-data-dot" />{source === 'live' ? 'LIVE API DATA' : 'ILLUSTRATIVE DATA'}</span>
                <h3 key={activeCategory.id}>{activeCategory.name}</h3>
                <p>{activeCategory.explanation}</p>
              </div>
              <div className="ef-card-total">
                <span>{hasMissing ? 'Measured subtotal' : 'Category total'}</span>
                <strong>{formatNumber(measuredTotal)}</strong>
                <small>kg CO₂e · {report.year}</small>
              </div>
            </div>
            <AnimatedBarChart category={activeCategory} values={activeValues} year={report.year} />
            <div className="ef-card-bottom">
              <span>{loadError ? 'Live API unavailable — showing example values.' : source === 'demo' ? 'Sample values, not measured emissions.' : hasMissing ? 'Some readings are not yet available.' : ' '}</span>
              <span>Annual emissions · scale adjusts per category</span>
            </div>
          </div>
        </div>

        <ComparisonStrip
          category={activeCategory}
          year={report.year}
          values={activeComparisons}
          isPlaceholder={isPlaceholderComparison}
          statusLabel={comparisonStatusLabel}
        />

        <div className="ef-exclusions">
          <h3>What we don’t count yet.</h3>
          <p>Possible gaps to review as we expand our measurements. These are suggested examples, not confirmed reporting exclusions.</p>
          <div className="ef-exclusion-grid">
            <div className="ef-exclusion-card">
              <span className="ef-exclusion-icon" aria-hidden="true">↗</span>
              <div><strong>End-User Devices</strong><span>Electricity used by visitors’ personal devices and home networks.</span></div>
            </div>
            <div className="ef-exclusion-card">
              <span className="ef-exclusion-icon" aria-hidden="true">↗</span>
              <div><strong>Upstream Network Equipment</strong><span>Embodied impacts of external network infrastructure, where not included in supplier data.</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}