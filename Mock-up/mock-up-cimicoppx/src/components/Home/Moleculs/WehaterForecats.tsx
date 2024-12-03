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
    { time: "10pm", temperature: 19 },
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
    <div className="w-[45.95%] ml-[-1rem] mt-[1px] absolute h-[18.9rem] p-1 flex items-center justify-center bg-[#f5f6f9]">
      {/* Contenedor interno para el contenido */}
      <div className="w-full h-full justify-between mt-24 z-20">
        <img
          src="/sunny.jpg"
          alt="sun"
          className="w-24 -z-10 -mt-[3rem] rounded-full absolute left-5 bottom-22"
        />
        {/* Encabezado con estado del clima y temperatura actual */}
        <div className="flex justify-between items-center mt-8">
          <div className="relative flex gap-14 flex-row items-center text-xl -mt-[5rem] ml-14 text-[#002060] ">
            <span className="ml-2 font-raleway text-[18pt]">Sunny</span>
            <span className="text-[#002060] flex font-roboto text-[21pt]">
              {weatherData[selectedIndex].temperature}°
              <FaTemperatureHalf className="text-center self-center font-thin h-5 -ml-1 mt-1" />
            </span>
            <span className="font-roboto text-[18pt] text-[#002060] flex ">
              0%
              <WiRain className="text-center self-center ml-2" />
            </span>
          </div>
        </div>

        {/* Barra de tiempo con navegación */}
        <div className="relative flex justify-center items-center w-[103%] gap-4 -ml-2 z-20">
          <ArrowButton
            direction="back"
            onClick={() => handleArrowClick("prev")}
            className="absolute left-0 text-[#002060] -mt-24 -ml-4"
          />
          {/* cambios aqui */}

          {weatherData.map((data, idx) => (
            <WeatherCard
              key={idx}
              time={data.time}
              temperature={data.temperature}
              isSelected={idx === selectedIndex}
            />
          ))}

          <ArrowButton
            direction="forward"
            onClick={() => handleArrowClick("next")}
            className="absolute right-0 text-[#002060] -mt-28 -mr-2"
          />
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;
