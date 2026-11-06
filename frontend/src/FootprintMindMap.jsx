import { useState } from 'react';
import elninoLogo from './assets/logo-elnino-black.svg';
import './FootprintMindMap.css';

// Values stay blank until the corresponding CO₂e calculations are connected.
const GROUPS = [
  {
    id: 'core',
    label: 'Transport',
    number: '01',
    categoryPosition: { x: 32.5, y: 34 },
    items: [
      {
        id: 'train', title: 'Train', x: 15, y: 14,
        details: 'Train journeys: distance travelled, ticket or route information, and an appropriate rail emissions factor.',
        value: '—', unit: 'kg CO₂e / year',
      },
      {
        id: 'car', title: 'Car', x: 15, y: 34,
        details: 'Car journeys: distance travelled, fuel or vehicle type, and an appropriate road-transport emissions factor.',
        value: '—', unit: 'kg CO₂e / year',
      },
      {
        id: 'walking-cycling', title: 'Walking / Cycling', x: 15, y: 54,
        details: 'Track travel distance. Walking and cycling have no direct fuel emissions; equipment lifecycle impacts can be counted separately.',
        value: '—', unit: 'kg CO₂e / year',
      },
    ],
  },
  {
    id: 'digital',
    label: 'Digital Systems',
    number: '02',
    categoryPosition: { x: 67.5, y: 34 },
    items: [
      {
        id: 'ai', title: 'AI', x: 85, y: 14, featured: true,
        details: 'AI usage: number of requests or compute-hours, energy consumed, and the electricity emissions factor. Avoid counting shared server energy twice.',
        value: '—', unit: 'kg CO₂e / year',
      },
      {
        id: 'servers', title: 'Servers', x: 85, y: 34,
        details: 'Server electricity from power draw, utilization, operating hours and data-centre overhead, converted using the applicable emissions factor.',
        value: '—', unit: 'kg CO₂e / year',
      },
      {
        id: 'cloud', title: 'Cloud', x: 85, y: 54,
        details: 'Cloud services: estimate emissions from allocated compute, storage and data transfer using provider usage and carbon information. Avoid double counting server or AI energy.',
        value: '—', unit: 'kg CO₂e / year',
      },
    ],
  },
  {
    id: 'shared',
    label: 'Offices',
    number: '03',
    categoryPosition: { x: 50, y: 75 },
    items: [
      {
        id: 'enschede', title: 'Enschede', x: 32.5, y: 91.5,
        details: 'Enschede office: measure electricity, heating, cooling and other building energy use with the corresponding emissions factors.',
        value: '—', unit: 'kg CO₂e / year',
      },
      {
        id: 'the-hague', title: 'The Hague', x: 50, y: 91.5,
        details: 'The Hague office: measure electricity, heating, cooling and other building energy use with the corresponding emissions factors.',
        value: '—', unit: 'kg CO₂e / year',
      },
      {
        id: 'bought-laptops', title: 'Bought Laptops', x: 67.5, y: 91.5,
        details: 'Purchased laptops: number of devices and product lifecycle or manufacturer-reported embodied emissions.',
        value: '—', unit: 'kg CO₂e / year',
      },
    ],
  },
];

function positionStyle(point) {
  return { '--node-x': `${point.x}%`, '--node-y': `${point.y}%` };
}

function Connections() {
  return (
    <svg className="fp-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path className="fp-trunk" d="M 50 51 Q 40 41 32.5 34" />
      <path className="fp-trunk" d="M 50 51 Q 60 41 67.5 34" />
      <path className="fp-trunk" d="M 50 51 Q 50 63 50 75" />
      {GROUPS.map((group) => group.items.map((item) => (
        <path
          key={item.id}
          className={`fp-branch fp-branch--${group.id}`}
          d={`M ${group.categoryPosition.x} ${group.categoryPosition.y} L ${item.x} ${item.y}`}
        />
      )))}
    </svg>
  );
}

export default function FootprintMindMap() {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <section className="footprint-section" id="carbon-footprint" aria-labelledby="footprint-heading">
      <div className="footprint-inner">
        <div className="fp-heading-row">
          <div>
            <div className="fp-kicker">MEASURING WHAT MATTERS / 02</div>
            <div className="fp-title-wrap">
              <span className="fp-title-accent" aria-hidden="true" />
              <h2 id="footprint-heading">Where our footprint comes from</h2>
            </div>
          </div>
          <p className="fp-intro">
            Explore the people, products and infrastructure behind our emissions.
            Hover, focus or tap a bubble for the measurement details.
          </p>
        </div>

        <div className="fp-map" aria-label="Interactive carbon footprint mind map">
          <Connections />

          <div className="fp-hub">
            <div className="fp-hub-ring">
              <img src={elninoLogo} alt="El Niño" className="fp-hub-logo" />
              <span className="fp-hub-caption">CARBON FOOTPRINT</span>
            </div>
          </div>

          {GROUPS.map((group) => (
            <div className={`fp-group fp-group--${group.id}`} key={group.id}>
              <div className="fp-category" style={positionStyle(group.categoryPosition)}>
                <span className="fp-category-index">{group.number}</span>
                <span>{group.label}</span>
              </div>

              <div className="fp-items">
                {group.items.map((item) => {
                  const expanded = selectedId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`fp-node fp-node--${group.id}${item.featured ? ' fp-node--featured' : ''}${expanded ? ' is-active' : ''}`}
                      style={positionStyle(item)}
                      aria-expanded={expanded}
                      aria-label={`${item.title}: ${item.details} ${item.value === '—' ? 'Measurement pending.' : item.value + ' ' + item.unit}`}
                      onClick={() => setSelectedId(expanded ? null : item.id)}
                    >
                      <span className="fp-node-front">
                        {item.featured && <span className="fp-node-eyebrow">PRIORITY SOURCE</span>}
                        <span className="fp-node-name">{item.title}</span>
                        {item.kind === 'input' && <span className="fp-node-small-note">measurement input</span>}
                      </span>
                      <span className="fp-node-info">
                        <strong className="fp-node-info-title">{item.title}</strong>
                        <span className="fp-node-description">{item.details}</span>
                        <span className="fp-node-metric">
                          <strong>{item.value}</strong>
                          <span>{item.unit}</span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
