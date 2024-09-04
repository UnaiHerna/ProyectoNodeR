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

interface DynamicChartProps {
  startDate: string;
  endDate: string;
}

const DynamicChart: React.FC<DynamicChartProps> = ({ startDate, endDate }) => {
  // States for different API data
  const [doSensData, setDoSensData] = useState<DataPoint[]>([]);
  const [nh4Data, setNh4Data] = useState<DataPoint[]>([]);
  const [qinfData, setQinfData] = useState<DataPoint[]>([]);

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

  // Fetch data when startDate or endDate changes
  useEffect(() => {
    fetchAllData();
  }, [startDate, endDate]);

  // Configure ECharts options for combined datasets with secondary Y-axis for Qinf
  const getCombinedOption = () => {
    const timeLabels = doSensData.map((d) => d.time);

    return {
      title: {},
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
          color: "orange"
        },
        {
          name: "NH4 Sensor",
          data: nh4Data.map((d) => d.value),
          type: "bar",
          color: "#A4C975"
        },
        {
          name: "Qinf Data",
          data: qinfData.map((d) => d.value),
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          color: "blue"
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
    <div style={{ height: "100%", width: "100%" }}>
      <h2>Datos Combinados de Sensores (DO, NH4, Qinf)</h2>
      <ReactECharts option={getCombinedOption()} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

export default DynamicChart;
