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
      className={`flex flex-col items-center w-ful h-auto gap-4 p-2 rounded-3xl shadow-2xl ${
        isSelected ? 'bg-[#f2f2f2] text-[#595959] font-bold font-roboto text-[14pt]' : 'bg-[#ffffff] font-roboto text-[10pt] text-[#595959]'
      }`}
    >
      <section className='flex flex-col items-center w-full h-auto gap-4 p-4'>
        <LuSunMedium size={34} className={isSelected ? 'text-[#595959]' : 'text-black'} />
        <div className='text-[#595959] font-roboto text-[10pt]'>{time}</div>
        <div className='text-[#595959] font-bold font-roboto text-[17pt]'>{temperature}°</div>
      </section>
    </div>
  );
};
// aqui
export default WeatherCard;
