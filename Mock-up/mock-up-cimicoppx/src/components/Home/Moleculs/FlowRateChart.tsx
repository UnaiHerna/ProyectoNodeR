import { useState } from "react";
import Plot from "react-plotly.js";
import ArrowButton from "./ArrowButton";

const ForecastChart = () => {
  const [xOffset, setXOffset] = useState(0); // Tracks the x-axis scroll offset for Plot
  const [xDataOffset, setXDataOffset] = useState(0); // Tracks the offset for displayed hours

  // Generating structured data for 72 hours (3 days)
  const data = Array.from({ length: 72 }, (_, hour) => {
    const modelValue = Math.sin(hour * 0.5) * 10;
    const uncertaintyFactor = Math.exp(hour / 10);
    return {
      hour,
      modelAverage: modelValue,
      upperBound: modelValue + 0.5 * uncertaintyFactor,
      lowerBound: modelValue - 0.5 * uncertaintyFactor,
    };
  });

  const forecastStartIndex = Math.floor(data.length * 0.4);

  // Generate the 10-hour display based on the current xDataOffset
  const numbers = Array.from({ length: 23 }, (_, i) => (i + xDataOffset) % 72);

  // Scroll functions to adjust both xOffset and xDataOffset
  const handleScrollLeft = () => {
    if (xOffset > 0) {
      setXOffset(xOffset - 5); // Move x-axis left
      setXDataOffset((xDataOffset - 1 + 72) % 72); // Decrement hour, wrap within 0–71
    } else {
      // Log when you've reached the leftmost limit
      console.log("Reached the leftmost limit");
    }
  };

  const handleScrollRight = () => {
    if (xOffset < data.length - 10) {
      setXOffset(xOffset + 5); // Move x-axis right
      setXDataOffset((xDataOffset + 1) % 72); // Increment hour, wrap within 0–71
    } else {
      // Log when you've reached the rightmost limit
      console.log("Reached the rightmost limit");
    }
  };

  // Extract the data for plotting based on the current offset
  const modelAverage = data.map((d) => d.modelAverage);
  const upperBound = data.map((d) => d.upperBound);
  const lowerBound = data.map((d) => d.lowerBound);

  // Determine whether the buttons should be visible
  const canScrollLeft = xOffset > 0;
  const canScrollRight = xOffset < data.length - 10;

  return (
    <div className="w-full h-full relative">
      {/* Display numbers with updated xDataOffset for hours */}
      <section className="w-full font-lato flex space-x-11 mt-2 ml-4 font-normal">
        {numbers.map((hour, idx) => (
          <span key={idx}>{hour}</span>
        ))}
      </section>

      {/* Arrow buttons positioned on the left and right */}
      <div className="absolute top-24 left-0 ml-[-2rem] w-[90rem] flex justify-between px-[-5rem] z-10">
  {/* Conditionally render the left button based on whether scrolling left is possible */}
  {canScrollLeft && (
    <ArrowButton direction="left" onClick={handleScrollLeft} />
  )}

  {/* Conditionally render the right button based on whether scrolling right is possible */}
  {canScrollRight && (
    <ArrowButton direction="right" onClick={handleScrollRight} className={canScrollLeft ? '' : 'self-end ml-[86.9rem]'} />
  )}
</div>


      <Plot
        data={[
          {
            x: [
              ...data.slice(forecastStartIndex).map((d) => d.hour),
              ...data
                .slice(forecastStartIndex)
                .map((d) => d.hour)
                .reverse(),
            ],
            y: [
              ...upperBound.slice(forecastStartIndex),
              ...lowerBound.slice(forecastStartIndex).reverse(),
            ],
            fill: "toself",
            fillcolor: "rgba(128, 128, 128, 0.2)",
            line: { color: "transparent", width: 0 },
            showlegend: false,
            type: "scatter",
          },
          {
            x: data.slice(0, forecastStartIndex + 1).map((d) => d.hour),
            y: modelAverage.slice(0, forecastStartIndex + 1),
            mode: "lines+markers",
            line: { color: "black", width: 3, shape: "spline" },
            marker: {
              color: data
                .slice(0, forecastStartIndex + 1)
                .map((_, i) =>
                  i === forecastStartIndex ? "#FFD700" : "#1f77b4"
                ),
              size: 15,
              line: {
                color: "white",
                width: 5,
              },
            },
            name: "Actual Data",
          },
          {
            x: [
              ...data
                .slice(forecastStartIndex - 1, forecastStartIndex)
                .map((d) => d.hour),
              ...data.slice(forecastStartIndex).map((d) => d.hour),
            ],
            y: [
              ...modelAverage.slice(forecastStartIndex - 1, forecastStartIndex),
              ...modelAverage.slice(forecastStartIndex),
            ],
            mode: "lines+markers",
            line: { color: "gray", width: 3, shape: "spline", dash: "dot" },
            marker: {
              color: [
                "#FFD700",
                ...data.slice(forecastStartIndex).map(() => "gray"),
              ],
              size: 15,
              line: {
                color: "white",
                width: 5,
              },
            },
            name: "Forecast",
          },
        ]}
        layout={{
          xaxis: {
            range: [xOffset, xOffset + 10],
            visible: true,
            showgrid: false,
          },
          yaxis: { visible: false, showgrid: false },
          showlegend: false,
          margin: { t: 40, l: 0, r: 0, b: 0 },
        }}
        config={{ displayModeBar: false }}
        style={{ width: "100%", height: "15rem" }}
      />
    </div>
  );
};

export default ForecastChart;
