import React, { useState } from "react";
import WeatherCard from "../Atoms/WheaderCrad"; // Importamos WeatherCard
import ArrowButton from "./ArrowButton"; // Importamos ArrowButton
import { FaTemperatureHalf } from "react-icons/fa6";
import { WiRain } from "react-icons/wi";

type WeatherData = {
  time: string;
  temperature: number;
};

const WeatherForecast: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Datos de pronóstico
  const weatherData: WeatherData[] = [
    { time: "Now", temperature: 21 },
    { time: "5pm", temperature: 22 },
    { time: "6pm", temperature: 22 },
    { time: "7pm", temperature: 21 },
    { time: "8pm", temperature: 20 },
    { time: "9pm", temperature: 19 },
  ];

  // Función para cambiar el índice
  const handleArrowClick = (direction: "next" | "prev") => {
    setSelectedIndex((prevIndex) => {
      if (direction === "next") {
        return (prevIndex + 1) % weatherData.length;
      } else {
        return (prevIndex - 1 + weatherData.length) % weatherData.length;
      }
    });
  };

  return (
    <div className="w-[48.33%] ml-[-1rem] absolute h-[18.3rem] p-2 flex items-center justify-center bg-[#f5f6f9]">
      {/* Contenedor interno para el contenido */}
      <div className="w-full h-full justify-between mt-24 z-20">
        <img
          src="/sunny.jpg"
          alt="sun"
          className="w-24 -z-10 -mt-[3rem] -ml-4 rounded-full absolute left-6"
        />
        {/* Encabezado con estado del clima y temperatura actual */}
        <div className="flex justify-between items-center mt-4">
          <div className="relative flex gap-14 flex-row items-center text-xl -mt-[5rem] ml-14 text-[#002060] ">
            <span className="ml-2 font-raleway text-[18pt]">Sunny</span>
            <span className="text-2xl text-[#002060] flex ">
              {weatherData[selectedIndex].temperature}°
              <FaTemperatureHalf className="text-center self-center font-thin" />
            </span>
            <span className="text-2xl text-[#002060] flex ">
              0 % 
              <WiRain className="text-center self-center ml-2"/>
            </span>
          </div>
        </div>

        {/* Barra de tiempo con navegación */}
        <div className="flex justify-center items-center gap-5 z-20">
          <ArrowButton
            direction="left"
            onClick={() => handleArrowClick("prev")}
            className="text-[#002060] -mt-16"
          />

          {weatherData.map((data, idx) => (
            <WeatherCard
              key={idx}
              time={data.time}
              temperature={data.temperature}
              isSelected={idx === selectedIndex}
            />
          ))}

          <ArrowButton
            direction="right"
            onClick={() => handleArrowClick("next")}
            className="text-[#002060] -mt-16"
          />
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;
