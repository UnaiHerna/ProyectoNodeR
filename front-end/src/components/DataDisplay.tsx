import React from 'react';
import useFetchData from '../hooks/useFetchData';
import LineChartComponent from './LineCharts';  

const DataDisplay: React.FC = () => {
  const { data, loading, error } = useFetchData();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (data) {
    const chartData = {
      labels: Array.from({ length: data.v_conc_anx.length }, (_, i) => `Point ${i + 1}`),
      v_conc_anx: data.v_conc_anx,
      v_conc_aer: data.v_conc_aer,
    };

    return (
      <div>
        <h1>Data Visualization</h1>
        <LineChartComponent data={chartData} />
      </div>
    );
  }

  return <p>No data available</p>;
};

export default DataDisplay;
