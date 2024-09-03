import React, { useEffect, useState } from "react";
import {
  fetchDOSensData,
  fetchNH4Data,
  fetchQinfData,
} from "../../helpers/apiHelper";
import ReactECharts from "echarts-for-react";

// Define types for data points
interface DataPoint {
  time: string;
  value: number;
}

const DynamicChart: React.FC = () => {
  // States for different API data
  const [doSensData, setDoSensData] = useState<DataPoint[]>([]);
  const [nh4Data, setNh4Data] = useState<DataPoint[]>([]);
  const [qinfData, setQinfData] = useState<DataPoint[]>([]);

  // States for date handling
  const [startDate] = useState("2024-09-01T00:00:00");
  const [endDate] = useState("2024-09-30T23:59:59");

  // Fetch data from all APIs
  const fetchAllData = async () => {
    try {
      const [doData, nh4DataResponse, qinfDataResponse] = await Promise.all([
        fetchDOSensData(startDate, endDate, "barchart"),
        fetchNH4Data(startDate, endDate, "barchart"),
        fetchQinfData(startDate, endDate, "timeseries"),
      ]);

      setDoSensData(doData);
      setNh4Data(nh4DataResponse);
      setQinfData(qinfDataResponse);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // Fetch data on component mount or when dates change
  useEffect(() => {
    fetchAllData();
  }, [startDate, endDate]);

  // Configure ECharts options for combined datasets with secondary Y-axis for Qinf
  const getCombinedOption = () => {
    const timeLabels = doSensData.map((d) => d.time);

    return {
      title: { },
      xAxis: {
        type: "category",
        data: timeLabels,
      },
      yAxis: [
        {
          type: "value",
          name: "DO / NH4 Values",
        },
        {
          type: "value",
          name: "Qinf Values",
          position: "right",
        },
      ],
      series: [
        {
          name: "DO Sensor",
          data: doSensData.map((d) => d.value),
          type: "bar",
        },
        {
          name: "NH4 Sensor",
          data: nh4Data.map((d) => d.value),
          type: "bar",
        },
        {
          name: "Qinf Data",
          data: qinfData.map((d) => d.value),
          type: "line",
          yAxisIndex: 1,
          smooth: true,
        },
      ],
      legend: {
        data: ["DO Sensor", "NH4 Sensor", "Qinf Data"],
      },
      tooltip: {
        trigger: "axis",
      },
    };
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <h2>Datos Combinados de Sensores (DO, NH4, Qinf)</h2>
      <ReactECharts option={getCombinedOption()} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default DynamicChart;
