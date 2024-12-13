import Plot from "react-plotly.js";
import forecast_json from "../../../helpers/forecast_data.json";
import ArrowButton from "./ArrowButton";

// Define el tipo de los datos
interface ForecastData {
  hour: number;
  modelAverage: number;
  upperBound: number;
  lowerBound: number;
}

const ForecastChart = () => {
  // Tipar el json de forecast_json
  const datosPronostico: ForecastData[] = forecast_json;

  // Mapeo de los datos necesarios para los gráficos
  const promedioModelo: number[] = datosPronostico.map((d) => d.modelAverage);
  const limiteSuperior: number[] = datosPronostico.map((d) => d.upperBound);
  const limiteInferior: number[] = datosPronostico.map((d) => d.lowerBound);
  const horas: number[] = datosPronostico.map((d) => d.hour);

  // Definir el índice de inicio del pronóstico
  const indiceInicioPronostico = Math.floor(datosPronostico.length * 0.4);

  return (
    <div className="w-full h-full">
      <ArrowButton
        direction="back"
        className="absolute left-0 text-[#002060] p-[10px] mt-28 ml-9 z-10"
      />
      <Plot
        data={[
          // Trazado 0: Área sombreada (límites superior e inferior)
          {
            x: [
              ...datosPronostico
                .slice(indiceInicioPronostico)
                .map((d) => d.hour),
              ...datosPronostico
                .slice(indiceInicioPronostico)
                .map((d) => d.hour)
                .reverse(),
            ],
            y: [
              ...limiteSuperior.slice(indiceInicioPronostico),
              ...limiteInferior.slice(indiceInicioPronostico).reverse(),
            ],
            fill: "toself",
            fillcolor: "rgba(128, 128, 128, 0.2)",
            line: { color: "transparent", width: 0 },
            showlegend: false,
            type: "scatter",
            hoverinfo: "skip", // Omitir tooltip para esta área sombreada
          },
          // Trazado 1: Datos reales (promedioModelo)
          {
            x: datosPronostico
              .slice(0, indiceInicioPronostico + 1)
              .map((d) => d.hour),
            y: promedioModelo.slice(0, indiceInicioPronostico + 1),
            mode: "lines+markers",
            line: { color: "black", width: 3, shape: "spline" },
            marker: {
              color: datosPronostico
                .slice(0, indiceInicioPronostico + 1)
                .map((_, i) =>
                  i === indiceInicioPronostico ? "#FFD700" : "#1f77b4"
                ),
              size: 15,
              line: { color: "white", width: 5 },
            },
            name: "Datos Reales",
            hoverinfo: "y", // Mostrar información en el tooltip
            hoverlabel: {
              bgcolor: "#ffecb4", // Fondo del tooltip
              font: {
                size: 20,
                color: "#002060", // Color del texto
              },
              bordercolor: "#ffecb4", // Sin borde visible
            },
            showlegend: false,
          },
          // Trazado 2: Datos de pronóstico (promedioModelo después de indiceInicioPronostico)
          {
            x: [
              ...datosPronostico
                .slice(indiceInicioPronostico - 1, indiceInicioPronostico)
                .map((d) => d.hour),
              ...datosPronostico
                .slice(indiceInicioPronostico)
                .map((d) => d.hour),
            ],
            y: [
              ...promedioModelo.slice(
                indiceInicioPronostico - 1,
                indiceInicioPronostico
              ),
              ...promedioModelo.slice(indiceInicioPronostico),
            ],
            mode: "lines+markers",
            line: { color: "gray", width: 3, shape: "spline", dash: "dot" },
            marker: {
              color: [
                "#3B7D23",
                ...datosPronostico
                  .slice(indiceInicioPronostico)
                  .map(() => "gray"),
              ],
              size: 14,
              line: { color: "white", width: 3 },
            },
            name: "Pronostico",
            hoverinfo: "y", // Mostrar información en el tooltip
            hoverlabel: {
              bgcolor: "#ffecb4",
              font: {
                size: 20,
                color: "#002060",
              },
              bordercolor: "#ffecb4",
            },
            showlegend: false,
          },
        ]}
        layout={{
          xaxis: {
            fixedrange: true,
            range: [-0.2, 23],
            dtick: 1,
            visible: true,
            showgrid: false,
            zeroline: false,
            tickmode: "array",
            tickvals: horas,
            ticktext: horas.map((hour, index) => {
              if (index === indiceInicioPronostico - 1) {
                return "<span style='color:green;'>Now</span>";
              } else if (index > indiceInicioPronostico - 1) {
                return `<span style='color:grey;'>${hour}</span>`;
              }
              return `<span style='color:black;'>${hour}</span>`;
            }),
            tickangle: 0,
            tickfont: {
              size: 16,
              family: "Lato",
            },
            side: "top",
          },
          yaxis: {
            visible: false,
            showgrid: false,
            fixedrange: true,
            zeroline: false,
          },
          showlegend: false,
          margin: { t: 25, l: 8, r: 0, b: 0 },
        }}
        config={{ displayModeBar: false }}
        className="w-full ml-1 h-full"
      />
    </div>
  );
};

export default ForecastChart;
