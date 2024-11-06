import Plot from "react-plotly.js";
import ArrowButton from "./ArrowButton";

const ForecastChart = () => {
  // Updated xData to have 38 time periods
  const xData = Array.from({ length: 38 }, (_, i) => i); // 38 data points

  // Modified modelAverage data to create 3 smooth mountain-like shapes with 38 points
  const modelAverage = [
    0, 0.1, 0.3, 0.7, 1.2, 1.7, 2.2, 2.6, 3, 3.3, 3.5, 3.6, 3.7, 3.7, 3.6, 3.5, 3.3, 3, 2.6, 2.2, 
    1.7, 1.2, 0.7, 0.3, 0.1, 0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 1.7, 1.9, 2.1, 2.3
  ];

  // Calculate upper and lower bounds based on the model average
  const upperBound = modelAverage.map((val, index) => {
    // Use an exponential growth factor to simulate increasing uncertainty
    const uncertaintyFactor = Math.exp(index / 10); // Increase uncertainty exponentially
    return val + 0.2 * uncertaintyFactor;  // Increased upper bound with exponential factor
  });
  
  const lowerBound = modelAverage.map((val, index) => {
    // Apply the same uncertainty factor for lower bounds
    const uncertaintyFactor = Math.exp(index / 10); // Increase uncertainty exponentially
    return val - 0.2 * uncertaintyFactor;  // Decreased lower bound with exponential factor
  });

  // Calculate forecast start index (40% of the total data points)
  const forecastStartIndex = Math.floor(xData.length * 0.27);  // Adjusted to start forecast earlier
  const numbers = Array.from({ length: 38 }, (_, i) => i);  // Updated number range

  return (
    <div className="w-full h-full">
      <section className="w-full font-lato flex space-x-11 mt-2 ml-4 font-normal">
        {numbers.map((number) => (
          <span key={number}>{number}</span>
        ))}
      </section>
      <section className="absolute top-44 left-0 z-10">
        <ArrowButton />
      </section>
      <Plot
        data={[
          // Shaded area for forecast uncertainty bounds (growing exponentially)
          {
            x: [
              ...xData.slice(forecastStartIndex),
              ...xData.slice(forecastStartIndex).reverse(),
            ],
            y: [
              ...upperBound.slice(forecastStartIndex),
              ...lowerBound.slice(forecastStartIndex).reverse(),
            ],
            fill: "toself", // This property fills the area between the upper and lower bounds
            fillcolor: "rgba(128, 128, 128, 0.2)", // Gray color with transparency
            line: { color: "transparent", width: 0 },
            showlegend: false,
            type: "scatter",
          },
          // Actual Data Line (Blue smooth line with last marker yellow)
          {
            x: xData.slice(0, forecastStartIndex + 1),  // Blue line spans the first 40% of the chart
            y: modelAverage.slice(0, forecastStartIndex + 1),
            mode: "lines+markers",
            line: { color: "#1f77b4", width: 3, shape: "spline" }, // Smooth line
            marker: {
              color: xData.slice(0, forecastStartIndex + 1).map((_, i) =>
                i === forecastStartIndex ? "#FFD700" : "#1f77b4" // Last point yellow, others blue
              ),
              size: 15,
              line: {
                color: "white",
                width: 5,
              },
            },
            name: "Actual Data",
          },
          // Forecast Line (Gray smooth line with first marker yellow)
          {
            x: xData.slice(forecastStartIndex),  // Gray line starts after the 40% mark
            y: modelAverage.slice(forecastStartIndex),
            mode: "lines+markers",
            line: { color: "gray", width: 3, shape: "spline", dash: "dot" }, // Smooth dotted line
            marker: {
              color: xData.slice(forecastStartIndex).map((_, i) =>
                i === 0 ? "#FFD700" : "gray" // First point yellow, others gray
              ),
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
          xaxis: { visible: false },
          yaxis: { visible: false },
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
