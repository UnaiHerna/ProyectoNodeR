import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import {
  fetchNH4Data,
  fetchNH4FiltData,
  fetchDO_SPData,
  fetchNh4_SPData,
  fetchDOSensData,
  fetchQinfData,
} from "../../helpers/apiHelper";
import { Spinner } from "@nextui-org/react";
import PieChartComponent from "./Piechart";

interface DataPoint {
  time: string;
  value: number | null;
  mode?: number; // Campo opcional para NNH4_SP
}

interface DynamicChartProps {
  startDate: string;
  endDate: string;
}

const SensorChartWithShadedAreas: React.FC<DynamicChartProps> = ({
  startDate,
  endDate,
}) => {
  const [nh4Data, setNh4Data] = useState<DataPoint[]>([]);
  const [nh4FiltData, setNh4FiltData] = useState<DataPoint[]>([]);
  const [doSPData, setDoSPData] = useState<DataPoint[]>([]);
  const [nh4SPData, setNh4SPData] = useState<DataPoint[]>([]);
  const [doSensData, setDoSensData] = useState<DataPoint[]>([]);
  const [qinfData, setQinfData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [zoomStartDate, setZoomStartDate] = useState<string>(startDate);
  const [zoomEndDate, setZoomEndDate] = useState<string>(endDate);

  useEffect(() => {
    const fetchData = async (start: string, end: string) => {
      try {
        setLoading(true); // Iniciar carga

        const [nh4, nh4Filt, doSP, nh4SP, doSens, qinf] = await Promise.all([
          fetchNH4Data(start, end),
          fetchNH4FiltData(start, end, "timeseries"),
          fetchDO_SPData(start, end),
          fetchNh4_SPData(start, end),
          fetchDOSensData(start, end),
          fetchQinfData(start, end),
        ]);

        setNh4Data(nh4);
        setNh4FiltData(nh4Filt);
        setDoSPData(doSP);
        setNh4SPData(nh4SP);
        setDoSensData(doSens);
        setQinfData(qinf);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Terminar carga
      }
    };

    fetchData(zoomStartDate, zoomEndDate);
  }, [zoomStartDate, zoomEndDate]);

  useEffect(() => {
    setZoomStartDate(startDate);
    setZoomEndDate(endDate);
  }, [startDate, endDate]);

  const getShadedAreas = (data: DataPoint[]): Partial<Plotly.Shape>[] => {
    const shapes: Partial<Plotly.Shape>[] = [];
    let start: string | null = null;

    for (let i = 0; i < data.length; i++) {
      if (data[i].mode === 0) {
        start = data[i].time; // Start of shaded area
      } else if (data[i].mode === 1 && start!=null) {
        shapes.push({
          type: "rect",
          xref: "x",
          yref: "paper",
          x0: start,
          y0: 0,
          x1: data[i].time,
          y1: 1,
          fillcolor: "rgba(150, 150, 255, 0.3)", // Light blue with transparency
          opacity: 0.5,
          line: { width: 0 },
        });
        start = null; // Reset start
      }
    }

    // Add last interval if not closed
    if (start) {
      shapes.push({
        type: "rect",
        xref: "x",
        yref: "paper",
        x0: start,
        y0: 0,
        x1: data[data.length - 1].time,
        y1: 1,
        fillcolor: "rgba(150, 150, 255, 0.3)",
        opacity: 0.5,
        line: { width: 0 },
      });
    }

    return shapes;
  };

  const handleRelayout = (event: Partial<Plotly.Layout>) => {
    if (event["xaxis.range[0]"] && event["xaxis.range[1]"]) {
      const newStartDate = new Date(event["xaxis.range[0]"]).toISOString();
      const newEndDate = new Date(event["xaxis.range[1]"]).toISOString();
      setZoomStartDate(newStartDate);
      setZoomEndDate(newEndDate);
    }
  };

  const formatDataToFixed = (data: DataPoint[]): DataPoint[] => {
    return data.map((item) => ({
      ...item,
      value:
        item.value !== null && item.value !== undefined
          ? parseFloat(item.value.toFixed(2))
          : null,
    }));
  };

  return (
    <div className="flex items-center w-[100%] h-[500px]">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50 z-10 h-full w-full">
          <div className="text-lg text-gray-800">
            <Spinner size="md" color="primary" />
          </div>
        </div>
      )}
      {/* Gráfico de Plotly */}
      <div className="flex-[0_0_70%] h-[90%] mb-5">
        <Plot
          className="w-full h-[29rem]"
          data={[
            {
              x: nh4SPData.map((item) => item.time),
              y: formatDataToFixed(nh4SPData).map((item) => item.value),
              type: "scatter",
              mode: "lines",
              name: "NNH4 SP",
              line: { color: "#1c4e80" },
              hoverinfo: "x+y+name",
            },
            {
              x: nh4FiltData.map((item) => item.time),
              y: formatDataToFixed(nh4FiltData).map((item) => item.value),
              type: "scatter",
              mode: "lines",
              name: "NH4_FILT",
              line: { color: "#2a9d8f" },
              hoverinfo: "x+y+name",
            },
            {
              x: doSensData.map((item) => item.time),
              y: formatDataToFixed(doSensData).map((item) => item.value),
              type: "scatter",
              mode: "lines",
              name: "DO_SENS",
              line: { color: "#e76f51" },
              hoverinfo: "x+y+name",
            },
            {
              x: doSPData.map((item) => item.time),
              y: formatDataToFixed(doSPData).map((item) => item.value),
              type: "scatter",
              mode: "lines",
              name: "DO_SP",
              line: { color: "#e63946" },
              hoverinfo: "x+y+name",
            },
            {
              x: nh4Data.map((item) => item.time),
              y: formatDataToFixed(nh4Data).map((item) => item.value),
              type: "scatter",
              mode: "lines",
              name: "NH4_SENS",
              line: { color: "#0077b6" },
              hoverinfo: "x+y+name",
            },
            {
              x: qinfData.map((item) => item.time),
              y: formatDataToFixed(qinfData).map((item) => item.value),
              type: "scatter",
              mode: "lines",
              name: "QINF",
              yaxis: "y2",
              line: { color: "black" },
              hoverinfo: "x+y+name",
            },
          ]}
          layout={{
            title: "Sensor Chart with Shaded Areas",
            xaxis: { title: "Time" },
            yaxis: { title: "Value (ppm)" },
            yaxis2: {
              title: "QINF (m³/h)",
              overlaying: "y",
              side: "right",
            },
            legend: {
              orientation: "h",
              x: 0,
              y: 1.15,
            },
            shapes: getShadedAreas(nh4SPData),
            hovermode: "x unified",
          }}
          config={{ responsive: true }}
          onRelayout={handleRelayout}
        />
      </div>
      
      {/* PieChartComponent */}
      <div className="flex-[0_0_20%] h-[100%] w-full">
        <PieChartComponent startDate={zoomStartDate} endDate={zoomEndDate} />
      </div>
    </div>
  );
};

export default SensorChartWithShadedAreas;
