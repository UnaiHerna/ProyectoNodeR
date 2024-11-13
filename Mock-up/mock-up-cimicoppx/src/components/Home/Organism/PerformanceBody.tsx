import React, { useState, useEffect } from "react";
import { BarChart, Bar, Tooltip, ResponsiveContainer } from "recharts";
import IconButton from "./IconButton";

interface StatsCardProps {
  title: string;
  value: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value }) => {
  return (
    <section className="flex flex-col text-white font-lato py-2 text-[10pt] text-center">
      <div className="bg-[#156082] text-white font-lato py-2 text-[10pt] shadow-xl">
        {title}
      </div>
      <div className="bg-white shadow-xl w-28 text-center flex flex-col h-full mt-[4px]">
        <div className="text-[#3B7D23] font-lato text-[24pt] text-center font-bold">
          {value}
        </div>
      </div>
    </section>
  );
};

const PerformanceBody: React.FC = () => {
  // Original data
  const chartData1 = [
    { time: "09:00", value: 1.5 },
    { time: "10:00", value: 1.8 },
    { time: "11:00", value: 2.0 },
    { time: "12:00", value: 2.3 },
    { time: "13:00", value: 2.4 },
    { time: "14:00", value: 2.1 },
    { time: "15:00", value: 2.2 },
    { time: "16:00", value: 2.5 },
  ];

  const chartData2 = [
    { time: "09:00", value: 0.27 },
    { time: "10:00", value: 0.3 },
    { time: "11:00", value: 0.33 },
    { time: "12:00", value: 0.35 },
    { time: "13:00", value: 0.37 },
    { time: "14:00", value: 0.4 },
    { time: "15:00", value: 0.42 },
    { time: "16:00", value: 0.45 },
  ];

  const chartData3 = [
    { time: "09:00", value: 0.13 },
    { time: "10:00", value: 0.15 },
    { time: "11:00", value: 0.17 },
    { time: "12:00", value: 0.18 },
    { time: "13:00", value: 0.2 },
    { time: "14:00", value: 0.22 },
    { time: "15:00", value: 0.25 },
    { time: "16:00", value: 0.28 },
  ];

  // New data for additional variables
  const chartData4 = [
    { time: "09:00", value: 3.1 },
    { time: "10:00", value: 3.4 },
    { time: "11:00", value: 3.6 },
    { time: "12:00", value: 3.8 },
    { time: "13:00", value: 4.0 },
    { time: "14:00", value: 4.3 },
    { time: "15:00", value: 4.5 },
    { time: "16:00", value: 4.7 },
  ];

  const chartData5 = [
    { time: "09:00", value: 5.2 },
    { time: "10:00", value: 5.5 },
    { time: "11:00", value: 5.7 },
    { time: "12:00", value: 6.0 },
    { time: "13:00", value: 6.2 },
    { time: "14:00", value: 6.5 },
    { time: "15:00", value: 6.8 },
    { time: "16:00", value: 7.0 },
  ];

  const chartData6 = [
    { time: "09:00", value: 0.5 },
    { time: "10:00", value: 0.55 },
    { time: "11:00", value: 0.6 },
    { time: "12:00", value: 0.65 },
    { time: "13:00", value: 0.7 },
    { time: "14:00", value: 0.75 },
    { time: "15:00", value: 0.8 },
    { time: "16:00", value: 0.85 },
  ];

  const [dataIndex, setDataIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0); // Track which StatsCard is active

  const handleNext = () => {
    setDataIndex((prev) => {
      const newIndex = prev + 1;
      setActiveIndex((prevIndex) => (prevIndex + 1) % 6); // Cycle through 0 to 5
      return newIndex;
    });
  };

  const handleBack = () => {
    setDataIndex((prev) => {
      const newIndex = prev - 1;
      setActiveIndex((prevIndex) => (prevIndex - 1 + 6) % 6); // Cycle through 0 to 5
      return newIndex;
    });
  };

  // Log the current dataIndex after it changes
  useEffect(() => {
    console.log("Current dataIndex:", dataIndex);
  }, [dataIndex]);

  // Trigger alert when activeIndex is 1 (second card)
  useEffect(() => {
    if (activeIndex === 2) {
      alert("The second card is active!");
    }
  }, [activeIndex]);

  // Use data based on the current chart
  const currentData =
    activeIndex === 0
      ? chartData1
      : activeIndex === 1
      ? chartData2
      : activeIndex === 2
      ? chartData3
      : activeIndex === 3
      ? chartData4
      : activeIndex === 4
      ? chartData5
      : chartData6;

  return (
    <div className="flex space-y-6 flex-col w-hull h-full">
      <section className="flex flex-row justify-center gap-2 mt-2 relative">
        <IconButton direction="back" onClick={handleBack} />

        {/* StatsCard with position indicator */}
        {/* <div className="relative flex flex-col items-center">
          <StatsCard title="N-NO₃" value={2.36} />
          <span
            className={`absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 h-[2px] transition-all duration-300 ${
              activeIndex === 0
                ? "block bg-cimicoLine h-[7px] w-[7rem]"
                : "hidden"
            }`}></span>
        </div> */}

        <div className="relative flex flex-col items-center">
          <StatsCard title="P-PO₄" value={0.27} />
          <span
            className={`absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 h-[2px] transition-all duration-300 ${
              activeIndex === 1
                ? "block bg-cimicoLine h-[7px] w-[7rem]"
                : "hidden"
            }`}
          ></span>
        </div>

        <div className="relative flex flex-col items-center">
          <StatsCard title="kWh/m³" value={0.13} />
          <span
            className={`absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 h-[2px] transition-all duration-300 ${
              activeIndex === 2
                ? "block bg-cimicoLine h-[7px] w-[7rem]"
                : "hidden"
            }`}
          ></span>
        </div>

        <div className="relative flex flex-col items-center">
          <StatsCard title="N-NO₃" value={2.36} />
          <span
            className={`absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 h-[2px] transition-all duration-300 ${
              activeIndex === 0
                ? "block bg-cimicoLine h-[7px] w-[7rem]"
                : "hidden"
            }`}
          ></span>
        </div>

        <IconButton direction="forward" onClick={handleNext} />
      </section>

      <div className="w-52 h-32 ml-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={currentData}>
            <Tooltip
              cursor={false} // Desactiva el cursor (el <path> alrededor de la barra)
              content={({ label, payload, coordinate }) => {
                if (payload && payload.length > 0 && coordinate) {
                  return (
                    <div
                      style={{
                        backgroundColor: "#ffecb4",
                        border: "none",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        paddingLeft: "1rem",
                        width: "8rem",
                        height: "4rem",
                        fontFamily: "Roboto",
                        fontSize: "16pt",
                        color: "#002060",
                        position: "absolute",
                        left: coordinate.x !== undefined ? coordinate.x + 8 : 0, // Verificar si 'coordinate.x' está definido
                        top: coordinate.y !== undefined ? coordinate.y - 30 : 0, // Verificar si 'coordinate.y' está definido
                        transform: "translateX(10px)", // Ajustar para que esté siempre a la derecha
                      }}
                    >
                      <p style={{ margin: 0 }}>{label}:00</p>
                      <p style={{ margin: 0 }}>{`${payload[0].value} ppm`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="value"
              fill="#e0f4d4"
              barSize={13}
              activeBar={{
                fill: "#407c24", // Color de la barra activa
                stroke: "#407c24",
                strokeWidth: 1,
              }}
              background={{ fill: "transparent" }}
            />
          </BarChart>
        </ResponsiveContainer>
        <hr className="w-[22rem] bg-[#f8f4f4] h-[2px]" />
      </div>
    </div>
  );
};

export default PerformanceBody;
