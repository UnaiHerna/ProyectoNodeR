import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { 
  fetchNH4Data, 
  fetchNH4FiltData, 
  fetchDO_SPData, 
  fetchDOSensData 
} from '../../helpers/apiHelper';
import { Data } from 'plotly.js'; // Importa Data para la tipificación

// Utility function to format dates as YYYY-MM-DDTHH:mm:ss
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

interface DataPoint {
  time: string;
  value: number;
}

const LineChartComponent: React.FC = () => {
  const now = new Date();
  const endDate = formatDate(now);

  const startDate = new Date(now);
  startDate.setHours(startDate.getHours() - 6);
  const formattedStartDate = formatDate(startDate);

  const [nh4Data, setNh4Data] = useState<DataPoint[]>([]);
  const [nh4FiltData, setNh4FiltData] = useState<DataPoint[]>([]);
  const [doSPData, setDoSPData] = useState<DataPoint[]>([]);
  const [doSensData, setDoSensData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nh4, nh4Filt, doSP, doSens] = await Promise.all([
          fetchNH4Data(formattedStartDate, endDate),
          fetchNH4FiltData(formattedStartDate, endDate, 'timeseries'),
          fetchDO_SPData(formattedStartDate, endDate),
          fetchDOSensData(formattedStartDate, endDate),
        ]);

        setNh4Data(nh4);
        setNh4FiltData(nh4Filt);
        setDoSPData(doSP);
        setDoSensData(doSens);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [formattedStartDate, endDate]);

  // Prepare the data for Plotly
  const plotData: Data[] = [
    {
      x: nh4Data.map(item => item.time),
      y: nh4Data.map(item => item.value),
      mode: 'lines+markers',
      type: 'scatter',
      name: 'NH4_SENS',
      line: { color: '#1f77b4' }, // Azul más brillante
    },
    {
      x: nh4FiltData.map(item => item.time),
      y: nh4FiltData.map(item => item.value),
      mode: 'lines+markers',
      type: 'scatter',
      name: 'NH4 FILT',
      line: { color: '#ff7f0e' }, // Naranja brillante
    },
    {
      x: doSPData.map(item => item.time),
      y: doSPData.map(item => item.value),
      mode: 'lines+markers',
      type: 'scatter',
      name: 'DO SP',
      line: { color: '#2ca02c' }, // Verde claro
    },
    {
      x: doSensData.map(item => item.time),
      y: doSensData.map(item => item.value),
      mode: 'lines+markers',
      type: 'scatter',
      name: 'DO',
      line: { color: '#d62728' }, // Rojo brillante
    },
  ];

  return (
    <div className='w-full h-[100%]'>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Plot
          data={plotData}
          className='w-full h-full'
          layout={{
            title: 'Last 6h values',
            xaxis: { title: 'Time' },
            yaxis: { title: 'Value (ppm)' },
            legend: { x: 0.5, y: 1.1, orientation: 'h', xanchor: 'center' },
            dragmode: false,
          }}
          style={{ height: '100%', width: '100%' }}
        />
      )}
    </div>
  );
};

export default LineChartComponent;
