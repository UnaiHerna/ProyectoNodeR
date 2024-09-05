import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { fetchNNH4_SPData } from '../../helpers/apiHelper'; // Adjust the path as needed

interface PieChartData {
  consigna: string;
  automatico: number;
  manual: number;
}

interface PropsP {
  startDate: string;
  endDate: string;
}

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
        color: ['#072AC8', '#909DAD']
      }
    ]
  };
};

const PieChartComponent: React.FC<PropsP> = ({ startDate, endDate }) => {
  const [data, setData] = useState<PieChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
  }, [startDate, endDate]);

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
        color: []
      }
    ]
  };

  const option = data ? getOption(data) : defaultOption;

  return (
    <div className='w-9/12 h-full p-0 m-0'>
      {loading && <p>Loading...</p>}
      {error && <p>Error fetching data: {error}</p>}
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
