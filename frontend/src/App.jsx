import { useState, useEffect } from 'react'
import FootprintMindMap from './FootprintMindMap';
import EnergyFlow from './EnergyFlow';
import FAQSection from "./FAQSection";
import AnnualHighlights from "./AnnualHighlights";
import elninoLogo from "./assets/logo-elnino-black.svg";
import arrowIcon from "./assets/icon-arrow-up-right.png";
import serverImage from "./assets/server_image.jpg";
import cpuIcon from "./assets/cpuImage.png";
import './App.css'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

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
            <a href="#footprint-mind-map" className="hero-button-primary">
              <span>SEE HOW WE MEASURE</span>

              <svg
                className="hero-arrow-down"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 4v16" />
                <path d="m6 14 6 6 6-6" />
              </svg>
            </a>


            <a
              href="/services"
              className="hero-button-white"
            >
              <span>OUR HOSTING SOLUTIONS</span>
              <img
                className="cpu-vector"
                src={cpuIcon}
                alt=""
              />
            </a>
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
      <AnnualHighlights />
      <div id="footprint-mind-map" className="mind-map-anchor">
        <FootprintMindMap />
      </div>
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
      <EnergyFlow />
      <section className="our-suppliers-section">
        <div className="our-suppliers-container">
          <div className="our-suppliers-sticker">
            <span>PROOF AND FACTS</span>
          </div>

          <div className="our-suppliers-content">
            <h2 className="our-suppliers-title">
              Our Suppliers and Partners
            </h2>
            {/* MapBox section - ask for key */}
          </div>
        </div>
      </section>
      <div className="separator" aria-hidden="true">
        <span className="separator-step-1"></span>
        <span className="separator-step-2"></span>
        <span className="separator-line"></span>
      </div>

      <section className="facts-section">
        <div className="facts-container">

          <span className="facts-label">RAW PROCESS FACTS</span>

          <h2 className="facts-heading">
            Numbers without the green gloss.
          </h2>

          <p className="facts-description">
            No green gloss here. There are two (or more if there is any)
            major blind spots in typical digital footprint models that
            we are working on integrating without guessing the data.
          </p>

          <div className="facts-grid">
            <div className="fact-card">
              <h3>3</h3>
              <p className="fact-title">Operating Areas Tracked</p>
              <p className="fact-description">
                Infrastructure, transit, and studio offices.
              </p>
            </div>

            <div className="fact-card">
              <h3>5</h3>
              <p className="fact-title">Footprint Categories</p>
              <p className="fact-description">
                Server power, transit, CDN networks,
                studio heating, fleet charging.
              </p>
            </div>

            <div className="fact-card">
              <h3>Annual</h3>
              <p className="fact-title">Methodology Review</p>
              <p className="fact-description">
                We update our mathematical models each January
                with fresh grid data.
              </p>
            </div>
          </div>

          <div className="facts-report">
            <div className="report-content">
              <h3>Want to know more?</h3>
              <p>
                We believe in exact numbers, so we offer full
                transparency. You can download the full sustainability
                report here and see for yourself how we make the
                numbers work in our favour.
              </p>
            </div>

            <a
              href="/reports/sustainability-report.pdf"
              download="Sustainability-Report.pdf"
              className="report-button"
            >
              SEE THE FULL REPORT HERE
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 17v4h14v-4" />
              </svg>
            </a>
          </div>
        </div>
      </section>
      <FAQSection />
      <div className="separator" aria-hidden="true">
        <span className="separator-step-1"></span>
        <span className="separator-step-2"></span>
        <span className="separator-line"></span>
      </div>

      <section className="lighter-cta-section">
        <div className="lighter-cta-container">

          <div className="lighter-cta-sticker">
            <span>MAKE YOUR SITE LIGHTER</span>
          </div>

          <h2 className="lighter-cta-heading">
            Build a faster site with a lighter footprint.
          </h2>

          <p className="lighter-cta-description">
            Work with a design and hosting partner that does the
            heavy structural modeling. Less bloat and faster loads.
          </p>

          <div className="lighter-cta-buttons">

            <a
              href="/contact?form=true"
              className="lighter-cta-primary"
            >
              <span>TALK TO US</span>

              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8
            8.5 8.5 0 0 1-7.6 4.7
            8.38 8.38 0 0 1-3.8-.9L3 21
            l1.9-5.7a8.38 8.38 0 0 1-.9-3.8
            8.5 8.5 0 0 1 4.7-7.6
            8.38 8.38 0 0 1 3.8-.9h.5
            a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>

            <a href="/services" className="lighter-cta-secondary">
              <span>EXPLORE HOSTING</span>

              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="5" y="5" width="14" height="14" rx="2" />
                <path d="M9 9h6v6H9z" />
                <path d="M9 1v4M15 1v4M9 19v4M15 19v4" />
                <path d="M19 9h4M19 14h4M1 9h4M1 14h4" />
              </svg>
            </a>

          </div>

        </div>
      </section>
    </div>
  )
}

export default App
