import Plot from "react-plotly.js";
import ArrowButton from "./ArrowButton";

const ForecastChart = () => {
  // Updated xData to have 25 time periods
  const xData = Array.from({ length: 25 }, (_, i) => i); 

  // Generate a sine wave for the model average (signal-like pattern)
  const modelAverage = xData.map((x) => Math.sin(x * 0.5) * 10);  // Increase the amplitude by multiplying by 10

  // Calculate upper and lower bounds based on the model average (growing uncertainty over time)
  const upperBound = modelAverage.map((val, index) => {
    // Use an exponential growth factor to simulate increasing uncertainty
    const uncertaintyFactor = Math.exp(index / 10); // Increase uncertainty exponentially
    return val + 0.5 * uncertaintyFactor;  // Increased upper bound with a bigger factor
  });

  const lowerBound = modelAverage.map((val, index) => {
    // Apply the same uncertainty factor for lower bounds
    const uncertaintyFactor = Math.exp(index / 10); // Increase uncertainty exponentially
    return val - 0.5 * uncertaintyFactor;  // Decreased lower bound with a bigger factor
  });

  // Calculate forecast start index (set to 40% of the total data points to start at 40%)
  const forecastStartIndex = Math.floor(xData.length * 0.40);  // Forecast starts at 40%
  const numbers = Array.from({ length: 24 }, (_, i) => i);  // Updated number range to match xData length

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
          // Actual Data Line (Black smooth line with last marker yellow)
          {
            x: xData.slice(0, forecastStartIndex + 1),  // Black line spans the first 40% of the chart
            y: modelAverage.slice(0, forecastStartIndex + 1),
            mode: "lines+markers",
            line: { color: "black", width: 3, shape: "spline" }, // Smooth line
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
            x: [
              ...xData.slice(forecastStartIndex - 1, forecastStartIndex), // Add the last point from the actual data (yellow dot)
              ...xData.slice(forecastStartIndex), // Start forecast from the next index
            ],
            y: [
              ...modelAverage.slice(forecastStartIndex - 1, forecastStartIndex), // Include the yellow dot for continuity
              ...modelAverage.slice(forecastStartIndex), // Forecast data
            ],
            mode: "lines+markers",
            line: { color: "gray", width: 3, shape: "spline", dash: "dot" }, // Smooth dotted line
            marker: {
              color: [
                "#FFD700", // First yellow dot after actual data line
                ...xData.slice(forecastStartIndex).map(() => "gray") // Subsequent points gray
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
