import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { PiChartLine } from "react-icons/pi";

interface MapAndChartProps {
  handleMapClick: () => void;
  handleChartClick: () => void;
  handleSpanClick: () => void;
  activeButton: string; // Recibe el estado activo del botón
  activeDataType: string;
}

const MapAndChart: React.FC<MapAndChartProps> = ({
  handleMapClick,
  handleChartClick,
  handleSpanClick,
  activeButton,
  activeDataType
}) => {
  return (
    <div className="flex items-center space-x-2">
      {/* Ícono de mapa clicable */}
      <button
        onClick={handleMapClick}
        className={`focus:outline-none ${activeButton === "map" || activeButton === "span" ? "text-[#002060]" : (activeButton === "chart" && activeDataType !== "ww" ? "text-[#002060]" : "text-[#f2f2f2]")}`}
      >
        <FaMapMarkerAlt />
      </button>

      {/* Span clicable */}
      <button
        onClick={handleSpanClick}
        className={`p-[1px] cursor-pointer text-white font-raleway w-[3rem] h-[25px] text-center ${activeButton === "span" ? "bg-[#002060] text-white" : "bg-[#f2f2f2] text-black"}`}
      >
        123
      </button>

      {/* Ícono del gráfico clicable */}
      <button
        onClick={handleChartClick}
        className={`text-[1.5rem] focus:outline-none ${activeButton === "chart" ? "text-[#002060]" : "text-[#cfcfcf75]"} ${activeDataType === "ww" ? "visible" : "invisible"}`}
      >
        <PiChartLine />
      </button>
    </div>
  );
};

export default MapAndChart;
