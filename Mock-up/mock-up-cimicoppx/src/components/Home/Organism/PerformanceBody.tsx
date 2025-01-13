import React, { useState } from "react";
import { BarChart, Bar, Tooltip, ResponsiveContainer } from "recharts";
import IconButton from "./IconButton";

interface StatsCardProps {
  title: string;
  value: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value }) => {
  return (
    <section className="flex flex-col gap-1 p-1 text-white font-lato lg:pb-2 md:text-medium sm:text-small lg:text-[17pt] xl:text-xl 2xl:text-2xl text-start w-full">
      <div className="bg-[#156082] text-white font-lato lg:py-0.5 md:text-medium sm:text-small lg:text-small xl:text-medium 2xl:text-large shadow-xl p-1">
        {title}
      </div>
      <div className="bg-white shadow-xl w-full text-center h-auto">
        <div className="text-[#3B7D23] font-lato lg:text-[28pt] w-full p-2 text-center font-bold">
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
    <div className="flex flex-col w-hull h-full space-y-9 md:space-y-12 lg:space-y-17 xl:space-y-20 2xl:space-y-12">
      <section className="flex flex-row justify-center gap-2 mt-2 relative">
        <IconButton direction="back" onClick={handleBack} />

        {cardData.map((card, index) => (
          <div key={index} className="relative flex flex-col items-center w-full h-auto">
            <StatsCard title={card.title} value={card.value} />
            <span
              className={`absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 h-auto w-full transition-all duration-300 ${
                activeIndex === index
                  ? "block bg-cimicoLine  lg:h-[7px] w-auto "
                  : "hidden"
              }`}
            ></span>
          </div>
        ))}

        <IconButton direction="forward" onClick={handleNext} />
      </section>

      <div className="w-auto h-28 items-end ml-6">
        <ResponsiveContainer width="50%" height="100%">
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
        <hr className="w-full bg-[#f8f4f4] h-auto" />
      </div>
    </div>
  );
};

export default PerformanceBody;
