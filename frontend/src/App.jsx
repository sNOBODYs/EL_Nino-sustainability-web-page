import { useState, useEffect } from 'react'
import FootprintMindMap from './FootprintMindMap';
import elninoLogo from "./assets/logo-elnino-black.svg";
import arrowIcon from "./assets/icon-arrow-up-right.png";
import serverImage from "./assets/server_image.jpg";
import cpuIcon from "./assets/cpuImage.png";
import './App.css'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const GROUPS = [
    {
      id: 'core',
      label: 'Core Systems',
      number: '01',
      categoryPosition: { x: 24, y: 27 },
      items: [
        {
          id: 'laptops', title: 'Laptops', x: 12, y: 12,
          details: 'Device power × active hours; include manufacturing emissions when the reporting scope covers hardware.',
          value: '—', unit: 'kg CO₂e / year'
        },
        {
          id: 'desktops', title: 'Desktops', x: 35, y: 12,
          details: 'Workstation electricity, CPU load, daily runtime and hardware replacement cycles.',
          value: '—', unit: 'kg CO₂e / year'
        },
        {
          id: '3d-printer', title: '3D printer', x: 12, y: 43,
          details: 'Printer power × print hours, plus filament and other materials where relevant.',
          value: '—', unit: 'kg CO₂e / year'
        },
        {
          id: 'printer', title: 'Regular printer', x: 34, y: 44,
          details: 'Printing and standby electricity, paper consumption and consumables.',
          value: '—', unit: 'kg CO₂e / year'
        },
      ],
    },
    {
      id: 'digital',
      label: 'Digital Systems',
      number: '02',
      categoryPosition: { x: 76, y: 27 },
      items: [
        {
          id: 'ai', title: 'AI usage', x: 64, y: 13, featured: true,
          details: 'Measure inference requests, CPU/GPU-hours, model size, data-centre efficiency and grid carbon intensity.',
          value: '—', unit: 'kg CO₂e / year'
        },
        {
          id: 'servers', title: 'Servers', x: 87, y: 12,
          details: 'Hosting electricity, average server power, utilization, uptime and provider energy mix.',
          value: '—', unit: 'kg CO₂e / year'
        },
        {
          id: 'cpu', title: 'CPU usage', x: 87, y: 36, kind: 'input',
          details: 'Track CPU utilization and active compute-hours. Allocate the electricity to AI, servers or devices to avoid double counting.',
          value: '—', unit: 'CPU-hours / month'
        },
        {
          id: 'codebases', title: 'Codebases', x: 79, y: 48,
          details: 'CI/CD builds, tests, deployments and background jobs: measure the compute used to run them.',
          value: '—', unit: 'kg CO₂e / year'
        },
        {
          id: 'webpages', title: 'Webpages', x: 63, y: 43,
          details: 'Page weight, visitor traffic, network transfer and browser processing energy.',
          value: '—', unit: 'kg CO₂e / year'
        },
      ],
    },
    {
      id: 'shared',
      label: 'Shared Resources',
      number: '03',
      categoryPosition: { x: 50, y: 80 },
      items: [
        {
          id: 'lighting', title: 'Lighting', x: 25, y: 70,
          details: 'Lamp wattage × hours of use; account for occupancy and lighting controls.',
          value: '—', unit: 'kg CO₂e / year'
        },
        {
          id: 'cooling', title: 'Air conditioning', x: 75, y: 70,
          details: 'Cooling system electricity, runtime, efficiency and refrigerant leakage if applicable.',
          value: '—', unit: 'kg CO₂e / year'
        },
        {
          id: 'heating', title: 'Heating', x: 34, y: 95,
          details: 'Electricity, district heat or fuel consumed for heating, with matching emissions factors.',
          value: '—', unit: 'kg CO₂e / year'
        },
        {
          id: 'electricity', title: 'General electricity', x: 67, y: 95,
          details: 'Remaining metered office electricity not already assigned to other categories.',
          value: '—', unit: 'kg CO₂e / year'
        },
      ],
    },
  ];

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 80) {
        setIsHeaderVisible(true);
      } else if (currentScrollY < lastScrollY) {
        setIsHeaderVisible(true);
      } else if (!isMenuOpen) {
        setIsHeaderVisible(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMenuOpen]);

  return (
    <div className="sustainability-page">
      <header className={`header ${isHeaderVisible || isMenuOpen ? 'header-visible' : 'header-hidden'
        }`}>
        <div className="container">
          <div className="row">
            <div className="col-16">
              <div className="header_inner">
                <a className="logo" aria-label="Home" href="/">
                  <img src={elninoLogo} alt="el nino logo" />
                </a>
                <nav
                  id="primary-navigation"
                  className={`nav ${isMenuOpen ? "nav--open" : ""}`}
                  aria-label="Primary"
                >
                  <ul>
                    <li id="list_in_nav">
                      <a className="nav_link" href="/case-studies">Cases</a>
                    </li>
                    <li id="list_in_nav">
                      <a className="nav_link" href="/services">Services</a>
                    </li>
                    <li id="list_in_nav">
                      <a className="nav_link" href="/insights">Insights</a>
                    </li>
                    <li id="list_in_nav">
                      <a className="nav_link" href="/partners">Partners</a>
                    </li>
                    <li id="list_in_nav">
                      <a className="nav_link" href="/culture">Culture</a>
                    </li>
                    <li id="list_in_nav">
                      <a className="nav_link" href="/careers">Careers</a>
                    </li>
                    <li id="list_in_nav">
                      <a className="nav_link is-active" href="/sustainability">Sustainability</a>
                    </li>
                    <li className="nav_button">
                      <a className="start_project_button" href="/contact?form=true">
                        <span>Start Project</span>
                        <span className="button_arrow_circle">
                          <img
                            className="button_arrow"
                            src={arrowIcon}
                            alt=""
                          />
                        </span>
                      </a>
                    </li>
                  </ul>
                </nav>
                <button
                  className={`nav_toggle ${isMenuOpen ? "is-open" : ""}`}
                  type="button"
                  aria-controls="primary-navigation"
                  aria-expanded={isMenuOpen}
                  aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <span className="nav_toggle_label">
                    {isMenuOpen ? "Close" : "Menu"}
                  </span>
                  <div className="nav_toggle_icon" aria-hidden="true">
                    <span className="nav_toggle_icon_top"></span>
                    <span className="nav_toggle_icon_center"></span>
                    <span className="nav_toggle_icon_bottom"></span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="hero-section">
        <div className="hero-section-info">
          <div className="hero-text">
            <div className="hero-text-sticker">
              <p>STRICTLY NO HYPE</p>
            </div>
            <p className="hero-text-header">The internet has a footprint. Ours is getting lighter.</p>
          </div>
          <p className="hero-description">Websites are not weightless. Every kilobyte transferred, every server humming in a warehouse,
            and every team stand-up uses electricity. We build and host digital products designed with strict
            carbon budgets and maintained by a team that travels exclusively in electric vehicles.</p>
          <div className="hero-section-buttons">
            <button className="hero-button-primary">
              <span>SEE HOW WE MEASURE</span>
              <span className="arrow-down"></span>
            </button>
            <button className="hero-button-white">
              <span>OUR HOSTING SOLUTIONS</span>
              <img className="cpu-vector" src={cpuIcon} alt="cpu-icon" />
            </button>
          </div>
        </div>
        <div className="hero-section-api-image">
          <div className="hero-api-top">
            <div className="hero-api-elipse">
              <span className="elipse-marked"></span>
              <span className="elipse-unmarked"></span>
              <span className="elipse-unmarked"></span>
            </div>
            <p>CURRENT_SERVER_NODE_01</p>
          </div>
          <img src={serverImage} alt="Server Image" />
          <div className="hero-api-bottom">
            <p className="hero-api-bottom-status">GRID STATUS:</p>
            <div className="hero-api-sticker">
              <p className="hero-api-bottom-answer">100% ENERGY ACOUNTED</p>
            </div>
          </div>
        </div>
      </div>
      <div className="separator" aria-hidden="true">
        <span className="separator-step-1"></span>
        <span className="separator-step-2"></span>
        <span className="separator-line"></span>
      </div>
      <section className="annual-highlights">
        <div className="annual-content">
          <div className="annual-heading">
            <span className="annual-heading-line"></span>
            <h2>Annual Highlights</h2>
          </div>

          <div className="annual-cards">
            <div className="annual-card">
              <h3>Total Emission</h3>
              <div className="annual-card-value">
                <span>SOME NUMBER</span>
              </div>
            </div>

            <div className="annual-card">
              <h3>Digital Products</h3>
              <div className="annual-card-value">
                <span>SOME NUMBER</span>
              </div>
            </div>

            <div className="annual-card">
              <h3>Offices</h3>
              <div className="annual-card-value">
                <span>SOME NUMBER</span>
              </div>
            </div>

            <div className="annual-card">
              <h3>Green Energy</h3>
              <div className="annual-card-value">
                <span>SOME NUMBER</span>
              </div>
            </div>
          </div>

        </div>
      </section>
      <FootprintMindMap />
      <section className="reality-check-section">
        <div className="reality-check-container">
          <div className="reality-check-sticker">
            <span>CHAPTER 01: REALITY CHECK</span>
          </div>

          <div className="reality-check-content">
            <h2 className="reality-check-title">
              No physical product. Still a footprint.
            </h2>

            <p className="reality-check-text">
              As a digital technology company, our work still has a physical impact.
              The code we develop, the servers that run our applications, the data we
              process, and the miles we travel to meet clients all have an environmental
              footprint. We keep it simple: we measure the total impact of our hosting
              services and agency operations to understand the footprint of the digital
              solutions we build and support.
            </p>
          </div>
        </div>
      </section>
      <div className="separator" aria-hidden="true">
        <span className="separator-step-1"></span>
        <span className="separator-step-2"></span>
        <span className="separator-line"></span>
      </div>
    </div>
  )
}

export default App
