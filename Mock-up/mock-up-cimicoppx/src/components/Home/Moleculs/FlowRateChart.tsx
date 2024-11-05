import Plot from "react-plotly.js";
import ArrowButton from "./ArrowButton";

const ForecastChart = () => {
  const xData = Array.from({ length: 12 }, (_, i) => i);
  const modelAverage = [0, 0.2, 0.5, 1, 1.5, 2, 2.1, 2, 1.8, 1.5, 1, 0.5];
  const upperBound = modelAverage.map((val) => val + 0.2);
  const lowerBound = modelAverage.map((val) => val - 0.2);

  // Index where forecast begins
  const forecastStartIndex = Math.floor(xData.length / 2);
  const numbers = Array.from({ length: 24 }, (_, i) => i); // Crea un arreglo de números del 0 al 23

  return (
    <div className="w-full h-full">
      <section className="w-full font-lato flex space-x-11 mt-2 ml-4 font-normal">
        {numbers.map((number) => (
          <span key={number}>{number}</span> // Renderiza cada número en un <span>
        ))}
      </section>
        <section className="absolute top-44 left-0 z-10">
        <ArrowButton />
        </section>
      <Plot
        data={[
          {
            x: [
              ...xData.slice(forecastStartIndex),
              ...xData.slice(forecastStartIndex).reverse(),
            ],
            y: [
              ...upperBound.slice(forecastStartIndex),
              ...lowerBound.slice(forecastStartIndex).reverse(),
            ],
            fill: "toself",
            fillcolor: "rgba(128, 128, 128, 0.2)",
            line: { color: "transparent" },
            showlegend: false,
            type: "scatter",
          },
          {
            x: xData.slice(0, forecastStartIndex + 1),
            y: modelAverage.slice(0, forecastStartIndex + 1),
            mode: "lines+markers",
            line: { color: "#1f77b4", width: 2 },
            marker: { color: "#1f77b4", size: 6 },
            name: "Actual Data",
          },
          {
            x: [xData[forecastStartIndex]],
            y: [modelAverage[forecastStartIndex]],
            mode: "markers",
            marker: { color: "#FFD700", size: 8 },
            showlegend: false,
          },
          {
            x: xData.slice(forecastStartIndex),
            y: modelAverage.slice(forecastStartIndex),
            mode: "lines+markers",
            line: { color: "gray", dash: "dash", width: 2 },
            marker: { color: "gray", size: 6 },
            name: "Forecast",
          },
          {
            x: [xData[forecastStartIndex]],
            y: [modelAverage[forecastStartIndex]],
            mode: "markers",
            marker: { color: "#FFD700", size: 8 },
            showlegend: false,
          },
        ]}
        layout={{
          xaxis: { visible: false },
          yaxis: { visible: false },
          showlegend: false,
          margin: { t: 40, l: 0, r: 0, b: 0 },
        }}
        config={{ displayModeBar: false }} // Disable the display mode bar
        style={{ width: "100%", height: "15rem" }} // Set the size to be 100%
      />
    </div>
  );
};

export default ForecastChart;
