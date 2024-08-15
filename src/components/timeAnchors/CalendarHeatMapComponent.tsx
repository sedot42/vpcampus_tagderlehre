import React, { useState, useEffect } from "react";
import "./heatmap.css"; // Import the CSS file

type HeatmapProps = {
  data: number[][]; // 2D array of numbers representing activity intensity for each 1-minute block per hour
  startHour: number; // The hour to start displaying from
  visibleHours: number; // Number of hours to display at a time
};

const generateHeatLevel = (value: number): string => {
  if (value >= 75) return "high";
  if (value >= 50) return "medium";
  if (value >= 25) return "low";
  return "none";
};

const Heatmap: React.FC<HeatmapProps> = ({ data, startHour, visibleHours }) => {
  const visibleData = data.slice(startHour, startHour + visibleHours);

  return (
    <div className="container">
      <div className="grid">
        {visibleData.map((hourData, hourOffset) => {
          const hour = startHour + hourOffset;
          return (
            <div key={hour} className="hourColumn">
              <div className="hourLabel">{hour}:00</div>
              <div className="matrix">
                {hourData.map((value, index) => (
                  <div
                    key={index}
                    className={`cell ${
                      index >= 60 ? "unused" : generateHeatLevel(value)
                    }`}
                    title={`Hour ${hour}, Minute ${index + 1}: ${
                      index >= 60 ? "Unused" : value + "%"
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CalendarHeatMapComponent = () => {
  const [startHour, setStartHour] = useState(0);
  const [visibleHours, setVisibleHours] = useState(8);

  const data: number[][] = Array.from({ length: 24 }, () =>
    Array.from({ length: 64 }, (_, index) =>
      index < 60 ? Math.floor(Math.random() * 100) : 0
    )
  );

  const handlePrev = () => {
    setStartHour((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartHour((prev) => Math.min(prev + 1, 24 - visibleHours));
  };

  useEffect(() => {
    const updateVisibleHours = () => {
      const width = window.innerWidth;
      const hourWidth = 160; // Width of each hour column (including margins)

      const hours = Math.max(1, Math.floor(width / hourWidth)); // At least 1 hour must be visible

      setVisibleHours(Math.min(hours, 8)); // Maximum 8 hours displayed at once
    };

    updateVisibleHours();

    window.addEventListener("resize", updateVisibleHours);
    return () => window.removeEventListener("resize", updateVisibleHours);
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Aktivitäten</h1>
      <div className="controls">
        <button onClick={handlePrev} className="button" disabled={startHour === 0}>
          &lt; Zurück
        </button>
        <button
          onClick={handleNext}
          className="button"
          disabled={startHour === 24 - visibleHours}
        >
          Weiter &gt;
        </button>
      </div>
      <Heatmap data={data} startHour={startHour} visibleHours={visibleHours} />
    </div>
  );
};
