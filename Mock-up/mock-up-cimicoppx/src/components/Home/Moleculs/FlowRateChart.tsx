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
  // const [xOffset, setXOffset] = useState<number>(0); // Desplazamiento del eje X

  // tipar el json de forecast_json
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
            hoverinfo: "text",
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
            hoverinfo: "text",
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
              // Reemplazar el texto con "Now" para el primer punto de pronóstico
              if (index === indiceInicioPronostico - 1) {
                return "<span style='color:green;'>Now</span>"; // Cambiar el texto por "Now" y darle color verde
              } else if (index > indiceInicioPronostico - 1) {
                return `<span style='color:grey;'>${hour}</span>`; // Para los demás puntos, mostrar la hora
              }
              return `<span style='color:black;'>${hour}</span>`; // Para los demás puntos, mostrar la hora
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
            zerolinecolor: "red",
          },
          showlegend: false,

          margin: { t: 25, l: 8, r: 0, b: 0 }, // Espacio para el eje X superior
        }}
        config={{ displayModeBar: false }}
        className="w-full -ml-1 h-full"
      />
    </div>
  );
};

export default ForecastChart;
