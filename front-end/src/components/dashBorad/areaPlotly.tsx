import React, { useEffect, useState, memo } from "react";
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

const formatData = (data: DataPoint[]) =>
  data
    .map((point) => ({
      time: point.time,
      value: point.value !== null ? point.value.toFixed(2) : null,
    }));

const SensorChartWithShadedAreas: React.FC<DynamicChartProps> = memo(
  ({ startDate, endDate }) => {
    const [nh4SPData, setNh4SPData] = useState<DataPoint[]>([]);
    const [nh4Data, setNh4Data] = useState<DataPoint[]>([]);
    const [nh4FiltData, setNh4FiltData] = useState<DataPoint[]>([]);
    const [doSPData, setDoSPData] = useState<DataPoint[]>([]);
    const [doSensData, setDoSensData] = useState<DataPoint[]>([]);
    const [qinfData, setQinfData] = useState<DataPoint[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [zoomStartDate, setZoomStartDate] = useState<string>(startDate);
    const [zoomEndDate, setZoomEndDate] = useState<string>(endDate);

    const fetchData = async (start: string, end: string) => {
      try {
        setLoading(true); // Iniciar carga

        const [nh4SP, nh4, nh4Filt, doSP, doSens, qinf] = await Promise.all([
          fetchNh4_SPData(start, end),
          fetchNH4Data(start, end),
          fetchNH4FiltData(start, end, "timeseries"),
          fetchDO_SPData(start, end),
          fetchDOSensData(start, end),
          fetchQinfData(start, end),
        ]);

        setNh4Data(nh4);
        setNh4FiltData(nh4Filt);
        setDoSPData(doSP);
        setDoSensData(doSens);
        setQinfData(qinf);
        setNh4SPData(nh4SP);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Terminar carga
      }
    };

    useEffect(() => {
      fetchData(zoomStartDate, zoomEndDate); // Carga de datos solo al cambiar zoom
    }, [zoomStartDate, zoomEndDate]);

    useEffect(() => {
      setZoomStartDate(startDate);
      setZoomEndDate(endDate);
      fetchData(startDate, endDate); // Carga de datos al cambiar fechas iniciales y finales
    }, [startDate, endDate]);

    const handleRelayout = (event: Partial<Plotly.Layout>) => {
      if (event["xaxis.range[0]"] && event["xaxis.range[1]"]) {
        const newStartDate = new Date(event["xaxis.range[0]"]).toISOString();
        const newEndDate = new Date(event["xaxis.range[1]"]).toISOString();

        const dateDiff =
          new Date(newEndDate).getTime() - new Date(newStartDate).getTime();
        const threeMonthsInMs = 3 * 30 * 24 * 60 * 60 * 1000; // Aproximadamente 3 meses en milisegundos

        // Solo actualiza el zoom si la diferencia entre fechas es menor a 3 meses
        if (Math.abs(dateDiff) < threeMonthsInMs) {
          setZoomStartDate(newStartDate);
          setZoomEndDate(newEndDate);
          fetchData(newStartDate, newEndDate); // Actualiza los datos cuando cambian las fechas
        }
      }
    };

    const modeArea = nh4SPData
      .filter((point) => point.mode === 1)
      .map((point) => point.time);

    const shapes: Partial<Plotly.Shape>[] =
      modeArea.length > 1
        ? [
            {
              type: "rect",
              xref: "x",
              yref: "paper",
              x0: modeArea[0],
              x1: modeArea[modeArea.length - 1],
              y0: 0,
              y1: 1,
              fillcolor: "rgba(7, 42, 200, 0.4)",
              opacity: 0.4,
              line: { width: 0 },
            },
          ]
        : [];

    return (
      <div className="grid grid-cols-5 h-[500px]">
        <div className="col-span-4 h-[90%] mb-50 relative">
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50 z-10 h-full w-full">
              <div className="text-lg text-gray-800">
                <Spinner size="md" color="primary" />
              </div>
            </div>
          )}
          {nh4SPData.length > 0 && (
            <Plot
              className="w-full h-full"
              data={[
                {
                  x: formatData(nh4SPData).map((point) => point.time),
                  y: formatData(nh4SPData).map((point) => point.value),
                  type: "scattergl",
                  mode: "lines",
                  name: "NNH4_SP",
                  line: { shape: "spline", color: "#1c4e80" },
                  marker: { color: "#1c4e80" },
                  hoverinfo: "x+y+name",
                },
                {
                  x: formatData(nh4Data).map((point) => point.time),
                  y: formatData(nh4Data).map((point) => point.value),
                  type: "scatter",
                  mode: "lines",
                  name: "NH4_SENS",
                  line: { shape: "spline", color: "#0077b6" },
                  marker: { color: "#0077b6" },
                  hoverinfo: "x+y+name",
                },
                {
                  x: formatData(nh4FiltData).map((point) => point.time),
                  y: formatData(nh4FiltData).map((point) => point.value),
                  type: "scatter",
                  mode: "lines",
                  name: "NH4 Filt",
                  line: { shape: "spline", color: "#2a9d8f" },
                  marker: { color: "#2a9d8f" },
                  hoverinfo: "x+y+name",
                },
                {
                  x: formatData(doSPData).map((point) => point.time),
                  y: formatData(doSPData).map((point) => point.value),
                  type: "scatter",
                  mode: "lines",
                  name: "DO_SP",
                  line: { shape: "spline", color: "#e63946" },
                  marker: { color: "#e63946" },
                  hoverinfo: "x+y+name",
                },
                {
                  x: formatData(doSensData).map((point) => point.time),
                  y: formatData(doSensData).map((point) => point.value),
                  type: "scatter",
                  mode: "lines",
                  name: "DO_SENS",
                  line: { shape: "spline", color: "#e76f51" },
                  marker: { color: "#e76f51" },
                  hoverinfo: "x+y+name",
                },
                {
                  x: formatData(qinfData).map((point) => point.time),
                  y: formatData(qinfData).map((point) => point.value),
                  type: "scatter",
                  mode: "lines",
                  name: "Qinf",
                  line: { shape: "spline", color: "rgb(0,0,0)" },
                  marker: { color: "rgb(0,0,0)" },
                  yaxis: "y2",
                  hoverinfo: "x+y+name",
                },
              ]}
              layout={{
                title: {
                  text: "",
                  font: { size: 18 },
                },
                xaxis: { title: "Time" },
                yaxis: {
                  title: "NNH4_SP",
                  showgrid: true,
                  zeroline: true,
                  showline: true,
                  gridcolor: "rgba(0,0,0,0.1)",
                },
                yaxis2: {
                  title: "Qinf",
                  overlaying: "y",
                  side: "right",
                  showgrid: false,
                  zeroline: true,
                  showline: true,
                  gridcolor: "rgba(0,0,0,0.1)",
                },
                shapes: shapes,
                showlegend: true,
                hovermode: "x unified",
                legend: {
                  orientation: "h", // Horizontal
                  x: 0.5,
                  y: 1.1,
                  xanchor: "center",
                  yanchor: "bottom",
                },
              }}
              config={{ responsive: true }}
              onRelayout={handleRelayout}
            />
          )}
        </div>
        <div className="col-span-1 h-[90%]">
          <PieChartComponent startDate={zoomStartDate} endDate={zoomEndDate} />
        </div>
      </div>
    );
  }
);

export default SensorChartWithShadedAreas;
