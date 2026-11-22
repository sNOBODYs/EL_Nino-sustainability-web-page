
import { useEffect, useState } from "react";
import "./AnnualHighlights.css";

// Temporary values — replace with backend data
const DEMO_HIGHLIGHTS = [
  {
    id: "total-emissions",
    title: "Total Emission",
    value: 24.6,
    unit: "t CO₂e"
  },
  {
    id: "digital-products",
    title: "Digital Products",
    value: 32,
    unit: ""
  },
  {
    id: "offices",
    title: "Offices",
    value: 3,
    unit: ""
  },
  {
    id: "green-energy",
    title: "Green Energy",
    value: 82,
    unit: "%"
  }
];

const API_URL = import.meta.env.VITE_ANNUAL_HIGHLIGHTS_API_URL;

function AnnualHighlights() {
  const [highlights, setHighlights] = useState(DEMO_HIGHLIGHTS);

  useEffect(() => {
    if (!API_URL) return;

    const controller = new AbortController();

    async function fetchHighlights() {
      try {
        const response = await fetch(API_URL, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Failed to fetch annual highlights");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const validHighlights = data.filter(
            (item) =>
              item &&
              typeof item.title === "string" &&
              item.title.trim() !== "" &&
              item.value !== null &&
              item.value !== undefined &&
              (typeof item.value === "string" ||
                (typeof item.value === "number" &&
                  Number.isFinite(item.value)))
          );

          if (validHighlights.length > 0) {
            setHighlights(validHighlights);
          } else {
            setHighlights(DEMO_HIGHLIGHTS);
          }
        } else {
          setHighlights(DEMO_HIGHLIGHTS);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Annual Highlights API error:", error);
          setHighlights(DEMO_HIGHLIGHTS);
        }
      }
    }

    fetchHighlights();

    return () => controller.abort();
  }, []);

  function formatValue(value) {
    if (typeof value === "number") {
      return value.toLocaleString("en-US", {
        maximumFractionDigits: 2
      });
    }

    return value;
  }

  return (
    <section className="annual-highlights">
      <div className="annual-content">

        <div className="annual-heading">
          <span
            className="annual-heading-line"
            aria-hidden="true"
          />
          <h2>Annual Highlights</h2>
        </div>

        <div className="annual-cards">
          {highlights.map((item, index) => (
            <div
              className="annual-card"
              key={item.id ?? index}
            >
              <h3>{item.title}</h3>

              <div className="annual-card-value">
                <span>
                  {formatValue(item.value)}
                  {item.unit && (
                    <span className="annual-value-unit">
                      {item.unit === "%" ? "" : " "}
                      {item.unit}
                    </span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default AnnualHighlights;