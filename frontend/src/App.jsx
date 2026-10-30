import { useState, useEffect } from 'react'
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
    </div>
  )
}

export default App
