import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { fetchHeatmapData } from '../../helpers/apiHelper';


/*

    n counter check failed
*/
// Define el tipo de datos que recibiremos del endpoint
interface HeatmapDataResponse {
  id: number;
  temp: number;
  mltss: number;
  sludge_prod: number;
}

interface ContourData {
  z: (number | null)[][];
  x: number[];
  y: number[];
  type: 'contour';
  colorscale: string;
  showscale: boolean;
  line: {
    color: string;
    smoothing: number;
    width: number;
  };
  contours: {
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
  autocontour?: boolean;
  ncontours?: number;
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

  const createPlotData = (): ContourData | null => {
    if (!data) return null;

    const temps = [...new Set(data.map(d => d.temp))];
    const mltss = [...new Set(data.map(d => d.mltss))];

    const z = temps.map(temp => {
      return mltss.map(mltssValue => {
        const entry = data.find(d => d.temp === temp && d.mltss === mltssValue);
        return entry ? entry.sludge_prod : null;
      });
    });

    return {
      z: z,
      x: mltss, // Valores en el eje X
      y: temps, // Valores en el eje Y
      type: 'contour',
      colorscale: 'Jet',
      showscale: false, // Ocultar la escala de colores
      line: {
        color: 'white',
        smoothing: 1.3,
        width: 1.8
      },
      contours: {
        coloring: 'heatmap',
        showlabels: true,
        start: 1958, // Inicio del contorno
        end: 2642, // Fin del contorno
        size: 57, // Tamaño entre líneas de contorno
        labelfont: {
          align: 'left',
          family: 'Raleway',
          size: 15,
          color: 'white',
        }
      },
      autocontour: false, // Si es false hace caso a start, end y size de los contornos
      ncontours: 8 // Número máximo de líneas de contorno
    };
  };

  const plotData = createPlotData();

  return (
    <div className='mt-[-2rem]'>
      {loading ? (
        <div className='flex justify-center items-center h-screen'>
          <div className='loader'>
            {/* Puedes usar un spinner o cualquier otro indicador de carga */}
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
            }}
            config={{ displayModeBar: false }}
            style={{ width: '100%', height: '100vh' }}
          />
        ) : (
          <p>No data available.</p>
        )
      )}
    </div>
  );
};

export default HeatmapChart;
