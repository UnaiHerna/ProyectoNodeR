// WeatherCard.tsx
import React from 'react';
import { LuSunMedium } from "react-icons/lu";

type WeatherCardProps = {
  time: string;
  temperature: number;
  isSelected: boolean;
};

const WeatherCard: React.FC<WeatherCardProps> = ({ time, temperature, isSelected }) => {
  return (
    <div
      className={`flex flex-col -mt-0 items-center px-7 py-5 gap-4 rounded-lg shadow-2xl ${
        isSelected ? 'bg-[#f2f2f2] text-[#595959] font-bold font-roboto text-[14pt]' : 'bg-[#ffffff] font-roboto text-[10pt] text-[#595959]'
      }`}
    >
      <LuSunMedium size={34} className={isSelected ? 'text-[#595959]' : 'text-black'} />
      <div className='text-[#595959] font-roboto text-[9pt]'>{time}</div>
      <div className='text-[#595959] font-bold font-roboto text-[14pt]'>{temperature}°</div>
    </div>
  );
};

export default WeatherCard;
