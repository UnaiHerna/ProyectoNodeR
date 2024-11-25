import { useState } from "react";
import Plot from "react-plotly.js";
import ArrowButton from "./ArrowButton";

const ForecastChart = () => {
  const [xOffset, setXOffset] = useState(0); // Desplazamiento del eje X para el gráfico
  const [xDataOffset, setXDataOffset] = useState(0); // Desplazamiento de los datos en el eje X

  const frequency = 0.2; // Frecuencia de la onda seno
  const initialAmplitude = 5; // Amplitud inicial
  const growthFactor = 0.1; // Factor de crecimiento para aumentar la amplitud con el tiempo
  const dataLength = 43; // Número total de puntos de datos de pronóstico

  const minValue = -1000; // Valor mínimo para los datos
  const maxValue = 3500; // Valor máximo para los datos

  // Generar los datos del pronóstico
  const data = Array.from({ length: dataLength }, (_, hour) => {
    const timeFactor = 6 + growthFactor * hour;
    const amplitude = initialAmplitude * Math.pow(1.05, timeFactor);
    const modelValue = Math.sin(hour * frequency) * amplitude;
    const shiftedValue = modelValue + (minValue + maxValue) / 2;
    const clampedValue = Math.min(Math.max(shiftedValue, minValue), maxValue);
    const raceTrackGap = hour * 0.5;
    const upperBound = clampedValue + raceTrackGap / 2;
    const lowerBound = clampedValue - raceTrackGap / 3;

    return { hour, modelAverage: clampedValue, upperBound, lowerBound };
  });

  // Asegurar que los últimos 3 valores sean mayores que los anteriores
  const lastThreeData = data.slice(-3);
  for (let i = 0; i < 3; i++) {
    if (lastThreeData[i].modelAverage <= lastThreeData[i - 1]?.modelAverage) {
      lastThreeData[i].modelAverage = lastThreeData[i - 1].modelAverage + 0.5;
    }
  }

  const forecastStartIndex = Math.floor(data.length * 0.4);

  // Calcular los números (horas) dinámicamente basado en xOffset
  const numbers = Array.from({ length: 24 }, (_, i) => {
    const hour = (i + xOffset) % 24; // Calcular la hora tomando en cuenta el desplazamiento
    return hour;
  });

  // Manejar el desplazamiento a la izquierda y derecha
  const handleScrollLeft = () => {
    if (xOffset > 0) {
      setXOffset(xOffset - 2);
      setXDataOffset((xDataOffset - 10 + 72) % 72);
    }
  };

  const handleScrollRight = () => {
    if (xOffset < data.length - 40) {
      setXOffset(xOffset + 2);
      setXDataOffset((xDataOffset + 9) % 72);
    }
  };

  // Preparar los datos para el gráfico
  const modelAverage = data.map((d) => d.modelAverage);
  const upperBound = data.map((d) => d.upperBound);
  const lowerBound = data.map((d) => d.lowerBound);

  const canScrollLeft = xOffset > 0;
  const canScrollRight = xOffset < data.length - 40;

  return (
    <div className="w-full h-full relative">
      {/* Mostrar las horas en la parte superior */}
      <section className="w-full font-lato flex space-x-10 mt-2 ml-4 font-normal">
        {numbers.map((hour, idx) => {
          // Verificar si el índice anterior es "Now" o si el índice es después de "Now"
          const isAfterNow = idx > numbers.indexOf(10); // Determina si es después de la hora "Now"

          return (
            <span
              key={idx}
              className={`${
                hour === 10
                  ? "text-lg font-lato text-[11pt] text-[#3B7D23] font-bold" // Si es la hora 10, aplica el estilo "Now"
                  : isAfterNow || hour === 23 // Si es después de la hora "Now" o es la hora 0, aplica color gris
                  ? "text-gray-400 text-[11pt]" // Para todas las horas después de "Now" o el 23, color gris
                  : "text-black text-[11pt]" // Para las horas antes de la hora "Now", color negro
              }`}
            >
              {hour === 10 ? "Now" : hour}
            </span>
          );
        })}
      </section>

      {/* Botones de desplazamiento (izquierda/derecha) */}
      <div className="absolute top-24 left-0 w-full flex justify-between z-10">
        {canScrollLeft && (
          <ArrowButton
            direction="left"
            onClick={handleScrollLeft}
            className="ml-[-2.5rem]"
          />
        )}
        {canScrollRight && (
          <ArrowButton
            direction="right"
            onClick={handleScrollRight}
            className={canScrollLeft ? "ml-[80rem]" : "ml-[80.2rem]"}
          />
        )}
      </div>

      {/* Gráfico utilizando Plotly */}
      <Plot
        data={[
          // Trazado 0: Área sombreada (límites superior e inferior)
          {
            x: [
              ...data.slice(forecastStartIndex).map((d) => d.hour),
              ...data
                .slice(forecastStartIndex)
                .map((d) => d.hour)
                .reverse(),
            ],
            y: [
              ...upperBound.slice(forecastStartIndex),
              ...lowerBound.slice(forecastStartIndex).reverse(),
            ],
            fill: "toself", // Rellenar entre los límites superior e inferior
            fillcolor: "rgba(128, 128, 128, 0.2)", // Color gris claro con transparencia
            line: { color: "transparent", width: 0 }, // Sin línea visible (solo área sombreada)
            showlegend: false, // No mostrar esta traza en la leyenda
            type: "scatter", // Tipo de gráfico scatter
          },
          // Trazado 1: Datos reales (modelAverage)
          {
            x: data.slice(0, forecastStartIndex + 1).map((d) => d.hour),
            y: modelAverage.slice(0, forecastStartIndex + 1),
            mode: "lines+markers",
            line: { color: "black", width: 3, shape: "spline" },
            marker: {
              color: data
                .slice(0, forecastStartIndex + 1)
                .map((_, i) =>
                  i === forecastStartIndex ? "#FFD700" : "#1f77b4"
                ),
              size: 15,
              line: { color: "white", width: 5 },
            },
            name: "Datos Reales",
            text: data
              .slice(0, forecastStartIndex + 1)
              .map((d) => d.modelAverage.toFixed(2)), // Solo el valor de modelAverage
            hoverinfo: "text", // Solo mostrar el texto en el tooltip
            showlegend: false,
          },
          // Trazado 2: Datos de pronóstico (modelAverage después de forecastStartIndex)
          {
            x: [
              ...data
                .slice(forecastStartIndex - 1, forecastStartIndex)
                .map((d) => d.hour),
              ...data.slice(forecastStartIndex).map((d) => d.hour),
            ],
            y: [
              ...modelAverage.slice(forecastStartIndex - 1, forecastStartIndex),
              ...modelAverage.slice(forecastStartIndex),
            ],
            mode: "lines+markers",
            line: { color: "gray", width: 3, shape: "spline", dash: "dot" },
            marker: {
              color: [
                "#3B7D23",
                ...data.slice(forecastStartIndex).map(() => "gray"),
              ],
              size: 15,
              line: { color: "white", width: 5 },
            },
            name: "Pronóstico",
            text: [
              ...data
                .slice(forecastStartIndex - 1, forecastStartIndex)
                .map((d) => d.modelAverage.toFixed(2)),
              ...data
                .slice(forecastStartIndex)
                .map((d) => d.modelAverage.toFixed(2)),
            ], // Solo el valor de modelAverage
            hoverinfo: "text", // Solo mostrar el texto en el tooltip
            showlegend: false,
          },
        ]}
        layout={{
          xaxis: {
            range: [xOffset, xOffset + 40],
            visible: false,
            showgrid: false,
          },
          yaxis: { visible: false, showgrid: false },
          showlegend: false,
          margin: { t: 40, l: 0, r: 0, b: 0 },
        }}
        config={{ displayModeBar: false }}
        style={{ width: "100%", height: "15rem" }}
      />
    </div>
  );
};

export default ForecastChart;
