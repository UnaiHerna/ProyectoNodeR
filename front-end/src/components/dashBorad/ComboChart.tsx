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
  value: number | null; // Permitir que el valor sea null
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
        boundaryGap: true, // Esto ayudará a centrar los puntos
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
          data: doSensData.map((d) =>
            d.value !== null ? parseFloat(d.value.toFixed(2)) : 0
          ),
          type: "bar",
          color: "#FF6F61", // Naranja
        },
        {
          name: "NH4 Sensor",
          data: nh4Data.map((d) =>
            d.value !== null ? parseFloat(d.value.toFixed(2)) : 0
          ),
          type: "bar",
          color: "#3BB143", // Verde
          barCategoryGap: "30%", // Ajustar el espacio entre las barras
        },
        {
          name: "Qinf Data",
          data: qinfData.map((d) =>
            d.value !== null ? parseFloat(d.value.toFixed(2)) : 0
          ),
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          color: "blue", // Mantener el color original
          symbol: "circle", // Mostrar puntos en la línea
          symbolSize: 10, // Tamaño de los puntos
          lineStyle: {
            width: 2, // Grosor de la línea
          },
          z: 3, // Asegura que la línea esté por encima de las barras
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
    <div className="w-full h-full">
      <h2>Combined Sensor Data (DO, NH4, Qinf)</h2>

      <ReactECharts
        option={getCombinedOption()}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};

export default DynamicChart;
