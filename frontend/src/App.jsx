import { useState } from 'react'
import elninoLogo from "./assets/logo-elnino-black.svg";
import arrowIcon from "./assets/icon-arrow-up-right.png";
import './App.css'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="sustainability-page">
      <header className="header">
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
    </div>
  )
}

export default App
