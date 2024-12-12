import React, { useState } from "react";
import { BarChart, Bar, Tooltip, ResponsiveContainer } from "recharts";
import IconButton from "./IconButton";

interface StatsCardProps {
  title: string;
  value: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value }) => {
  return (
    <section className="flex flex-col text-white font-lato lg:py-2 lg:text-[10pt] text-start w-full">
      <div className="bg-[#156082] text-white font-lato lg:py-2 lg:text-[13pt] shadow-xl p-1">
        {title}
      </div>
      <div className="bg-white shadow-xl  lg:w-28 text-center flex flex-col h-auto lg:mt-[4px]">
        <div className="text-[#3B7D23] font-lato lg:text-[24pt] text-center font-bold">
          {value}
        </div>
      </div>
    </section>
  );
};

const PerformanceBody: React.FC = () => {
  const chartData = [
    [
      { time: "09:00", value: 1.5 },
      { time: "10:00", value: 1.8 },
      { time: "11:00", value: 2.0 },
      { time: "12:00", value: 2.3 },
      { time: "13:00", value: 2.4 },
      { time: "14:00", value: 2.1 },
      { time: "15:00", value: 2.2 },
      { time: "16:00", value: 2.5 },
    ],
    [
      { time: "09:00", value: 0.27 },
      { time: "10:00", value: 0.3 },
      { time: "11:00", value: 0.33 },
      { time: "12:00", value: 0.35 },
      { time: "13:00", value: 0.37 },
      { time: "14:00", value: 0.4 },
      { time: "15:00", value: 0.42 },
      { time: "16:00", value: 0.45 },
    ],
    [
      { time: "09:00", value: 0.13 },
      { time: "10:00", value: 0.15 },
      { time: "11:00", value: 0.17 },
      { time: "12:00", value: 0.18 },
      { time: "13:00", value: 0.2 },
      { time: "14:00", value: 0.22 },
      { time: "15:00", value: 0.25 },
      { time: "16:00", value: 0.28 },
    ],
  ];

  const cardData = [
    { title: "N-NO₃", value: 2.36 },
    { title: "P-PO₄", value: 0.27 },
    { title: "kWh/m³", value: 0.13 },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % cardData.length);
  };

  const handleBack = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + cardData.length) % cardData.length);
  };

  const currentData = chartData[activeIndex];

  return (
    <div className="flex space-y-6 flex-col w-hull h-full">
      <section className="flex flex-row justify-center gap-2 mt-2 relative">
        <IconButton direction="back" onClick={handleBack} />

        {cardData.map((card, index) => (
          <div key={index} className="relative flex flex-col items-center">
            <StatsCard title={card.title} value={card.value} />
            <span
              className={`absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 h-[2px] transition-all duration-300 ${
                activeIndex === index
                  ? "block bg-cimicoLine h-[7px] w-[7rem]"
                  : "hidden"
              }`}
            ></span>
          </div>
        ))}

        <IconButton direction="forward" onClick={handleNext} />
      </section>

      <div className="lg:w-52 lg:h-32 lg:ml-6 lg:-top-2 w-full h-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={currentData}>
            <Tooltip
              cursor={false}
              content={({ label, payload, coordinate }) => {
                if (payload && payload.length > 0 && coordinate) {
                  return (
                    <div
                      style={{
                        backgroundColor: "#ffecb4",
                        padding: "0.5rem",
                        fontSize: "12pt",
                        color: "#002060",
                      }}
                    >
                      <p>{label}:00</p>
                      <p>{`${payload[0].value} ppm`}</p>
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
