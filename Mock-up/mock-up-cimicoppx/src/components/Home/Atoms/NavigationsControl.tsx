import React from "react";
import IconButton from "../Organism/IconButton";

interface NavigationControlsProps {
  lineLabel: string;
  handleClick: (direction: "back" | "forward") => void; // New prop for handling clicks
}

const NavigationControls: React.FC<NavigationControlsProps> = ({ lineLabel, handleClick }) => {
  return (
    <div className="flex flex-row items-center gap-2 ml-auto">
      {/* Usar IconButton para la navegación hacia la izquierda */}
      <IconButton
        direction="back"
        className="text-gray-500" // Flecha izquierda gris
        onClick={() => handleClick("back")} // Trigger handleClick with "back"
      />

      {/* Etiqueta de la línea sin salto de línea */}
      <span className="text-blue-900 font-raleway text-[11pt] w-full whitespace-nowrap">
        {lineLabel}
      </span>

      {/* Usar IconButton para la navegación hacia la derecha */}
      <IconButton
        direction="forward"
        className="text-blue-900" // Flecha derecha azul
        onClick={() => handleClick("forward")} // Trigger handleClick with "forward"
      />
    </div>
  );
};

export default NavigationControls;
