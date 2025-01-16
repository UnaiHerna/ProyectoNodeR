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
    <div className="w-[100.9%] h-[89%] flex items-center justify-center bg-[#f5f6f9] p-0 m-0 -ml-1 mt-0">
      {/* Contenedor interno para el contenido */}
      <div className="w-full h-auto justify-between pl-2">
        <img
          src="/sunny.jpg"
          alt="sun"
          className="w-24 -mt-[4rem] rounded-full absolute left-5 bottom-22"
        />

        {/* Encabezado con estado del clima y temperatura actual */}
        <div className="flex flex-col sm:flex-row justify-between items-center lg:px-4 text-[#002060]">
          <div className="relative flex gap-8 sm:gap-14 flex-row items-center text-xl sm:-mt-[3rem] ml-4 sm:ml-14 text-[#002060]">
            <span className="ml-2 font-raleway text-[18pt]">Sunny</span>
            <span className="text-[#002060] flex font-roboto text-[21pt] sm:text-[24pt]">
              {weatherData[selectedIndex].temperature}°
              <FaTemperatureHalf className="text-center self-center font-thin h-5 -ml-1 mt-1" />
            </span>
            <span className="font-roboto text-[18pt] sm:text-[20pt] text-[#002060] flex ">
              0%
              <WiRain className="text-center self-center ml-2"/>
            </span>
          </div>
        </div>

        {/* Barra de tiempo con navegación */}
        <div className="relative flex justify-center items-center w-full z-20 gap-5">
          <section className="flex flex-row justify-between w-full absolute">
            <ArrowButton
              direction="back"
              onClick={() => handleArrowClick("prev")}
              className="text-[#002060] p-[10px]"
            />
            <ArrowButton
              direction="forward"
              onClick={() => handleArrowClick("next")}
              className="text-[#002060] p-[10px]"
            />
          </section>

          {weatherData.map((data, idx) => (
            <WeatherCard
            key={idx}
            time={data.time}
            temperature={data.temperature}
            isSelected={idx === selectedIndex}
          />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;
