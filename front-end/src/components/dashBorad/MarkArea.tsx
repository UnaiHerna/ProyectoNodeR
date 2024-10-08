import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { fetchNH4Data, fetchNH4FiltData, fetchDO_SPData, fetchNh4_SPData, fetchDOSensData, fetchQinfData } from '../../helpers/apiHelper'; // Import the necessary functions

interface DataPoint {
  time: string;
  value: number;
  mode?: number; // Optional field for NNH4_SP
  consigna?: string; // Optional field for NNH4_SP
}

interface DynamicChartProps {
  startDate: string;
  endDate: string;
}

const NNH4_SPChart: React.FC<DynamicChartProps> = ({ startDate, endDate }) => {
  const [nh4Data, setNh4Data] = useState<DataPoint[]>([]);
  const [nh4FiltData, setNh4FiltData] = useState<DataPoint[]>([]);
  const [doSPData, setDoSPData] = useState<DataPoint[]>([]);
  const [nh4SPData, setNh4SPData] = useState<DataPoint[]>([]);
  const [doSensData, setDoSensData] = useState<DataPoint[]>([]); // State for DO_SENS data
  const [qinfData, setQinfData] = useState<DataPoint[]>([]); // New state for QINF data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nh4, nh4Filt, doSP, nh4SP, doSens, qinf] = await Promise.all([
          fetchNH4Data(startDate, endDate),
          fetchNH4FiltData(startDate, endDate, 'timeseries'),
          fetchDO_SPData(startDate, endDate),
          fetchNh4_SPData(startDate, endDate),
          fetchDOSensData(startDate, endDate), // Fetch DO_SENS data
          fetchQinfData(startDate, endDate) // Fetch QINF data
        ]);

        setNh4Data(nh4);
        setNh4FiltData(nh4Filt);
        setDoSPData(doSP);
        setNh4SPData(nh4SP);
        setDoSensData(doSens); // Set DO_SENS data
        setQinfData(qinf); // Set QINF data
        setLoading(false);
        localStorage.setItem("key", JSON.stringify(nh4));
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const getModeAreas = (data: DataPoint[]) => {
    const areas: { xAxis: string | null }[][] = [];
    let start: string | null = null;

    for (let i = 0; i < data.length; i++) {//aqui
      if (data[i].mode === 0) {
        start = data[i].time; // Start of mode 1
      } else if (data[i].mode === 1) {
        areas.push([{ xAxis: start }, { xAxis: data[i].time }]);
        start = null; // Reset start
      }
    }

    // Add last interval if not closed
    if (start !== null) {
      areas.push([{ xAxis: start }, { xAxis: data[data.length - 1].time }]);
    }

    return areas;
  };

  // Define the chart options
  const option = {
    title: {
      text: 'NNH4 SP Data',
      subtext: 'API Data',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: ['NNH4 SP', 'NH4_FILT', 'DO_SENS', 'DO_SP', 'NH4', 'QINF'], // Include all series in the legend
      top: '5%',
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: doSensData.map((item) => item.time), // Use time data from NNH4_SP
      },
      {
        type: 'category',
        position: 'top',
        data: qinfData.map((item) => item.time), // Use time data from QINF
        axisLabel: {
          show: false, // Hide the labels for the secondary x-axis
        },
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'PPM',
        axisLabel: {
          formatter: '{value} ppm',
        },
        axisPointer: {
          snap: true,
        },
      },
      {
        type: 'value',
        name: 'QINF',
        position: 'right',
        axisLabel: {
          formatter: '{value} (m³/h)', // Adjust unit as needed
        },
      }
    ],
    series: [
      {
        name: 'NNH4 SP',
        type: 'line',
        smooth: true,
        data: nh4SPData.map((item) => item.value),
        markArea: {
          name: "MODE",
          itemStyle: {
            color: '#5369f5', // Color of the marked areas
          },
          data: getModeAreas(nh4SPData), // Highlight areas where mode = 1
        },
      },
      {
        name: 'NH4_FILT',
        type: 'line',
        smooth: true,
        data: nh4FiltData.map((item) => item.value), // Ensure default value is 0 if undefined
      },
      {
        name: 'DO_SENS',
        type: 'line',
        smooth: true,
        data: doSensData.map((item) => item.value), // Data for DO_SENS
      },
      {
        name: 'DO_SP',
        type: 'line',
        smooth: true,
        data: doSPData.map((item) => item.value), // Ensure default value is 0 if undefined
      },
      {
        name: 'NH4',
        type: 'line',
        smooth: true,
        data: nh4Data.map((item) => item.value), // Data for NH4
      },
      {
        name: 'QINF',
        type: 'line',
        smooth: true,
        yAxisIndex: 1, // Use the right y-axis
        data: qinfData.map((item) => item.value), // Data for QINF
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0, // Ensure this index matches the main xAxis
        start: 0,
        end: 100,
      },
      {
        type: 'slider',
        xAxisIndex: 0, // Ensure this index matches the main xAxis
        start: 0,
        end: 100,
      },
    ],
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ReactEcharts option={option} style={{ height: '400px', width: '100%' }} />
      )}
    </div>
  );
};

export default NNH4_SPChart;