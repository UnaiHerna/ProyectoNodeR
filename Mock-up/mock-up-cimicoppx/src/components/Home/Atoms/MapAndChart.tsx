import { PiChartLine } from "react-icons/pi";
import { FaMapMarkerAlt } from "react-icons/fa";

const MapAndChart: React.FC = () => {
  // Funciones para manejar el clic
  const handleMapClick = () => {
    console.log("Map marker clicked");
    // Aquí puedes realizar cualquier acción que desees
  };

  const handleChartClick = () => {
    console.log("Chart icon clicked");
    // Aquí puedes realizar cualquier acción que desees
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Hacer clic en el ícono de mapa */}
      <button onClick={handleMapClick} className="text-[#002060] focus:outline-none">
        <FaMapMarkerAlt />
      </button>

      <span className="p-[1px] cursor-pointer text-white font-raleway bg-[#f2f2f2] italic w-[3rem] h-[25px] text-center">
        123
      </span>

      {/* Hacer clic en el ícono del gráfico */}
      <button onClick={handleChartClick} className="text-[#cfcfcf75] text-[1.5rem] focus:outline-none">
        <PiChartLine />
      </button>
    </div>
  );
};

export default MapAndChart;
