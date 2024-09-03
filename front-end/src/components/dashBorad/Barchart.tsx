import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { fetchConsignaAvgModoData } from '../../helpers/apiHelper'; // Adjust the import path as needed

const BarChartComponent: React.FC = () => {
  // Define state for data, loading, and error
  const [data, setData] = useState<{ product: string[]; values: number[][] } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const startDate = '2024-08-01'; // Example start date
        const endDate = '2024-09-20'; // Example end date

        // Fetch data for NH4 and DO_SP
        const nh4Data = await fetchConsignaAvgModoData('nnh4_sp', startDate, endDate);
        const doSpData = await fetchConsignaAvgModoData('do_sp', startDate, endDate);
        // Prepare data for ECharts
        const product = ['NH4_SP', 'DO_SP'];
        const values = [
          [nh4Data.manual, nh4Data.automatico],
          [doSpData.manual, doSpData.automatico],
        ];

        setData({ product, values });
      } catch (error) {
        setError('Error fetching data');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Define the ECharts option based on fetched data
  const option = {
    legend: {},
    tooltip: {},
    dataset: {
      source: data ? [
        ['product', 'Manual', 'Automatic'],
        ...data.product.map((p, i) => [p, ...data.values[i]])
      ] : []
    },
    xAxis: { type: 'category' },
    yAxis: {},
    series: data ? [
      { type: 'bar', name: 'Manual' },
      { type: 'bar', name: 'Automatic' }
    ] : []
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <ReactEcharts
        option={option}
        echarts={echarts}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
};

export default BarChartComponent;
