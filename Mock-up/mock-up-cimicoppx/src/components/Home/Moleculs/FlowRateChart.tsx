import Plot from 'react-plotly.js';

const ForecastChart = () => {
  const xData = Array.from({ length: 12 }, (_, i) => i);
  const modelAverage = [0, 0.2, 0.5, 1, 1.5, 2, 2.1, 2, 1.8, 1.5, 1, 0.5];
  const upperBound = modelAverage.map(val => val + 0.2);
  const lowerBound = modelAverage.map(val => val - 0.2);

  // Index where forecast begins
  const forecastStartIndex = Math.floor(xData.length / 2);

  return (
    <Plot
      data={[
        // Confidence Interval (Shaded Area for Forecast starting from the midpoint)
        {
          x: [...xData.slice(forecastStartIndex), ...xData.slice(forecastStartIndex).reverse()],
          y: [...upperBound.slice(forecastStartIndex), ...lowerBound.slice(forecastStartIndex).reverse()],
          fill: 'toself',
          fillcolor: 'rgba(128, 128, 128, 0.2)', // Light gray fill
          line: { color: 'transparent' },
          showlegend: false,
          type: 'scatter',
        },
        // Actual Line (solid blue, from start to midpoint)
        {
          x: xData.slice(0, forecastStartIndex + 1),
          y: modelAverage.slice(0, forecastStartIndex + 1),
          mode: 'lines+markers',
          line: { color: '#1f77b4', width: 2 },  // Solid blue line
          marker: { color: '#1f77b4', size: 6 },
          name: 'Actual Data',
        },
        // Final Actual Data Point in #FFD700
        {
          x: [xData[forecastStartIndex]],
          y: [modelAverage[forecastStartIndex]],
          mode: 'markers',
          marker: { color: '#FFD700', size: 8 },
          showlegend: false,
        },
        // Forecast Line (dashed gray, starting from midpoint)
        {
          x: xData.slice(forecastStartIndex),
          y: modelAverage.slice(forecastStartIndex),
          mode: 'lines+markers',
          line: { color: 'gray', dash: 'dash', width: 2 },  // Dashed gray line
          marker: { color: 'gray', size: 6 },
          name: 'Forecast',
        },
        // First Forecast Data Point in #FFD700
        {
          x: [xData[forecastStartIndex]],
          y: [modelAverage[forecastStartIndex]],
          mode: 'markers',
          marker: { color: '#FFD700', size: 8 },
          showlegend: false,
        },
      ]}
      layout={{
        title: 'Forecast Chart with Dashed Forecast Section',
        xaxis: { visible: false },
        yaxis: { visible: false },
        showlegend: false,
      }}
    />
  );
};

export default ForecastChart;
