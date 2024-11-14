import React from "react";
import { PiChartLine } from "react-icons/pi";
import { FaMapMarkerAlt } from "react-icons/fa";

interface MapAndChartProps {
  handleMapClick: () => void;
  handleChartClick: () => void;
  handleSpanClick: () => void;
}

const MapAndChart: React.FC<MapAndChartProps> = ({
  handleMapClick,
  handleChartClick,
  handleSpanClick
}) => {
  return (
    <div className="flex items-center space-x-2">
      {/* Ícono de mapa clicable */}
      <button onClick={handleMapClick} className="text-[#002060] focus:outline-none">
        <FaMapMarkerAlt />
      </button>

      {/* Span clicable */}
      <button
        onClick={handleSpanClick}
        className="p-[1px] cursor-pointer text-white font-raleway bg-[#f2f2f2] italic w-[3rem] h-[25px] text-center"
      >
        123
      </button>

      {/* Ícono del gráfico clicable */}
      <button onClick={handleChartClick} className="text-[#cfcfcf75] text-[1.5rem] focus:outline-none">
        <PiChartLine />
      </button>
    </div>
  );
};

export default MapAndChart;
