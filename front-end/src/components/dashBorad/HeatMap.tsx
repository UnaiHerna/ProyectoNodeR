import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { fetchHeatmapData } from '../../helpers/apiHelper';

// Define the type of data we will receive from the endpoint
interface HeatmapDataResponse {
  id: number;
  temp: number;
  mltss: number;
  sludge_prod: number;
}

interface ContourData {
  z: (number | null)[][]; // Z values representing the heatmap intensity
  x: number[]; // X-axis values
  y: number[]; // Y-axis values
  type: 'contour'; // Type of plot
  colorscale: string; // Color scale to apply to the heatmap
  showscale: boolean; // Whether to show the color scale
  line: { // Line properties for contour lines
    color: string;
    smoothing: number;
    width: number;
  };
  contours: { // Contour settings
    coloring: 'heatmap' | 'fill' | 'lines' | 'none';
    showlabels: boolean;
    start: number;
    end: number;
    size: number;
    labelfont: {
      align: string;
      family: string;
      size: number;
      color: string;
    };
  };
  hovertemplate: string; // Custom hover template
  autocontour?: boolean; // Auto-generate contours if true
  ncontours?: number; // Number of contours
}

const HeatmapChart: React.FC = () => {
  const [data, setData] = useState<HeatmapDataResponse[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchHeatmapData()
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching heatmap data:', error);
        setLoading(false);
      });
  }, []);

  // Function to create the Plotly plot data
  const createPlotData = (): ContourData | null => {
    if (!data) return null;

    // Get unique values for temp (Y-axis) and mltss (X-axis)
    const temps = [...new Set(data.map(d => d.temp))];
    const mltss = [...new Set(data.map(d => d.mltss))];

    // Generate the Z-values based on temp and mltss
    const z = temps.map(temp => {
      return mltss.map(mltssValue => {
        const entry = data.find(d => d.temp === temp && d.mltss === mltssValue);
        return entry ? entry.sludge_prod : null; // If no data, return null
      });
    });

    return {
      z: z, // Z-values representing heatmap intensity (sludge_prod)
      x: mltss, // X-axis: MLTSS
      y: temps, // Y-axis: Temperature
      type: 'contour', // Contour plot
      colorscale: 'Rainbow', // Color scale for the heatmap
      showscale: false, // Hide the color scale
      line: {
        color: 'white', // Contour line color
        smoothing: 1.3, // Line smoothing
        width: 3.5 // Line thickness
      },
      contours: {
        coloring: 'heatmap', // Fill the contours with color
        showlabels: true, // Show contour labels
        start: 1958, // Start value for contour lines
        end: 2642, // End value for contour lines
        size: 57, // Step size between contour lines
        labelfont: {
          align: 'left', // Text alignment for labels
          family: 'Raleway', // Font family for labels
          size: 35, // Font size for labels
          color: 'white', // Font color for labels
        }
      },
      hovertemplate: 'Temperature: %{y} ºC<br>MLTSS: %{x} gSS/m3<br>Sludge Production: %{z} kg SS/d<extra></extra>',
      autocontour: false, // Manually set the contour lines
      ncontours: 8 // Number of contour lines
    };
  };

  const plotData = createPlotData();

  return (
    <div className='mt-[-2rem]'>
      {loading ? (
        <div className='flex justify-center items-center h-screen'>
          <div className='loader'>
            {/* Loading spinner */}
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0115.8-4.7 1 1 0 011.4 1.4A10 10 0 003 12a1 1 0 011.8-1.4A8 8 0 014 12z"></path>
            </svg>
          </div>
        </div>
      ) : (
        plotData ? (
          <Plot
            data={[plotData]}
            layout={{
              title: 'Sludge Production [kg SS/d]',
              xaxis: { title: 'MLTSS [gSS/m3]' },
              yaxis: { title: 'Temperature ºC' },
              hovermode: 'closest', // Enable closest point hover
              hoverlabel: {
                bgcolor: 'white', // Background color of hover box
                font: { color: 'black', size: 16 }, // Text color and size in hover box
              },
            }}
            config={{ displayModeBar: false }} // Disable mode bar
            style={{ width: '100%', height: '100vh' }} // Full screen height
          />
        ) : (
          <p>No data available.</p> // Fallback if no data
        )
      )}
    </div>
  );
};

export default HeatmapChart;
