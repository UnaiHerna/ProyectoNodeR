import { useState } from "react";
import Plot from "react-plotly.js";
import ArrowButton from "./ArrowButton";
import forecast_json from "../../../helpers/forecast_data.json";

// Define el tipo de los datos
interface ForecastData {
  hour: number;
  modelAverage: number;
  upperBound: number;
  lowerBound: number;
}

const ForecastChart = () => {
  const [xOffset, setXOffset] = useState<number>(0); // Desplazamiento del eje X

  // Convertir el objeto de forecast_json en un array
  const datosPronostico: ForecastData[] = forecast_json;

  // Mapeo de los datos necesarios para los gráficos
  const promedioModelo: number[] = datosPronostico.map((d) => d.modelAverage);
  const limiteSuperior: number[] = datosPronostico.map((d) => d.upperBound);
  const limiteInferior: number[] = datosPronostico.map((d) => d.lowerBound);
  const horas: number[] = datosPronostico.map((d) => d.hour);

  // Funciones para manejar el desplazamiento
  const manejarDesplazamientoIzquierda = () => {
    if (xOffset > 0) {
      setXOffset(xOffset - 2);
    }
  };

  const manejarDesplazamientoDerecha = () => {
    if (xOffset < datosPronostico.length - 40) {
      setXOffset(xOffset + 1);
    }
  };

  // Definir el índice de inicio del pronóstico
  const indiceInicioPronostico = Math.floor(datosPronostico.length * 0.4);

  // Crear un arreglo con los números de las horas para mostrar
  const numeros: number[] = horas;

  const puedeDesplazarIzquierda = xOffset > 0;
  const puedeDesplazarDerecha = xOffset < datosPronostico.length - 40;

  return (
    <div className="w-full h-full relative">
      {/* Mostrar las horas en la parte superior */}

      {/* Botones de desplazamiento (izquierda/derecha) */}
      {/* <div className="absolute top-24 left-0 w-full flex justify-between z-10">
        {puedeDesplazarIzquierda && (
          <ArrowButton
            direction="back"
            onClick={manejarDesplazamientoIzquierda}
            className="ml-[-2.5rem]"
          />
        )}
        {puedeDesplazarDerecha && (
          <ArrowButton
            direction="forward"
            onClick={manejarDesplazamientoDerecha}
            className={puedeDesplazarIzquierda ? "ml-[80rem]" : "ml-[80.2rem]"}
          />
        )}
      </div> */}

      {/* Gráfico utilizando Plotly */}
      <Plot
        data={[
          // Trazado 0: Área sombreada (límites superior e inferior)
          {
            x: [
              ...datosPronostico.slice(indiceInicioPronostico).map((d) => d.hour),
              ...datosPronostico.slice(indiceInicioPronostico).map((d) => d.hour).reverse(),
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
            x: datosPronostico.slice(0, indiceInicioPronostico + 1).map((d) => d.hour),
            y: promedioModelo.slice(0, indiceInicioPronostico + 1),
            mode: "lines+markers",
            line: { color: "black", width: 3, shape: "spline" },
            marker: {
              color: datosPronostico
                .slice(0, indiceInicioPronostico + 1)
                .map((_, i) =>
                  i === indiceInicioPronostico ? "#FFD700" : "#1f77b4"
                ),
              size: 13,
              line: { color: "white", width: 5 },
            },
            name: "Datos Reales",
            text: datosPronostico
              .slice(0, indiceInicioPronostico + 1)
              .map((d) => d.modelAverage.toFixed(2)),
            hoverinfo: "text",
            showlegend: false,
          },
          // Trazado 2: Datos de pronóstico (promedioModelo después de indiceInicioPronostico)
          {
            x: [
              ...datosPronostico.slice(indiceInicioPronostico - 1, indiceInicioPronostico).map((d) => d.hour),
              ...datosPronostico.slice(indiceInicioPronostico).map((d) => d.hour),
            ],
            y: [
              ...promedioModelo.slice(indiceInicioPronostico - 1, indiceInicioPronostico),
              ...promedioModelo.slice(indiceInicioPronostico),
            ],
            mode: "lines+markers",
            line: { color: "gray", width: 3, shape: "spline", dash: "dot" },
            marker: {
              color: [
                "#3B7D23",
                ...datosPronostico.slice(indiceInicioPronostico).map(() => "gray"),
              ],
              size: 12,
              line: { color: "white", width: 5 },
            },
            name: "Pronóstico",
            text: [
              ...datosPronostico.slice(indiceInicioPronostico - 1, indiceInicioPronostico).map((d) => d.modelAverage.toFixed(2)),
              ...datosPronostico.slice(indiceInicioPronostico).map((d) => d.modelAverage.toFixed(2)),
            ],
            hoverinfo: "text",
            showlegend: false,
          },
        ]}
        layout={{
          xaxis: {
            range: [0, 47],
            dtick: 1,
            visible: true,
            showgrid: true,
            tickmode: 'array', // Usar valores personalizados para los ticks
            tickvals: horas,   // Especificar las horas como los valores de los ticks
            ticktext: horas.map(hour => hour.toString()), // Convertir los valores a cadenas para mostrarlos
            tickangle: 90, // Opcional: Rota los números si son demasiado largos
          },
          yaxis: { visible: false, showgrid: false },
          showlegend: false,
          margin: { t: 0, l: 0, r: 0, b: 0 },
        }}
        config={{ displayModeBar: false }}
        style={{ width: "102.2%", height: "14rem" }}
      />
    </div>
  );
};

export default ForecastChart;
