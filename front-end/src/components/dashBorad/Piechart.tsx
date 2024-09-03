import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { fetchNNH4_SPData } from '../../helpers/apiHelper'; // Adjust the path as needed

// Define the type for the pie chart data
interface PieChartData {
  consigna: string;
  automatico: number;
  manual: number;
}

// Configuration for the pie chart
const getOption = (data: PieChartData) => {
  const total = data.automatico + data.manual;
  const automaticoPercentage = (data.automatico / total) * 100;
  const manualPercentage = (data.manual / total) * 100;

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: ({d}%)'
    },
    legend: {
      top: '5%',
      left: 'center',
      formatter: (name: string) => {
        if (name === 'Automatico') {
          return `Automatico: ${automaticoPercentage.toFixed(2)}%`;
        }
        if (name === 'Manual') {
          return `Manual: ${manualPercentage.toFixed(2)}%`;
        }
        return name;
      }
    },
    series: [
      {
        name: 'Distribution',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: data.automatico, name: 'Automatico' },
          { value: data.manual, name: 'Manual' }
        ],
        color: ['#072AC8', '#909DAD'] // Color for Automatico and Manual
      }
    ]
  };
};

// PieChartComponent
const PieChartComponent: React.FC = () => {
  const [data, setData] = useState<PieChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use fixed dates or parameters for the API call
        const startDate = '2024-04-04T09:57';
        const endDate = '2024-09-03T09:57';

        // Fetch the NNH4 SP data
        const fetchedData = await fetchNNH4_SPData(startDate, endDate);
        setData(fetchedData);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Default option when data is not yet available
  const defaultOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: ({d}%)'
    },
    legend: {
      top: '5%',
      left: 'center',
      formatter: () => ''
    },
    series: [
      {
        name: 'Distribution',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [],
        color: [] // Empty array for default option
      }
    ]
  };

  const option = data ? getOption(data) : defaultOption;

  return (
    <div className='w-9/12 h-full p-0 m-0'>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <ReactEcharts
          option={option}
          style={{ height: '100%', width: '100%' }}
        />
      )}
    </div>
  );
};

export default PieChartComponent;
