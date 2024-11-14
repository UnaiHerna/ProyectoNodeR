import React from "react";
import IconButton from "../Organism/IconButton"; 

interface NavigationControlsProps {
  lineLabel: string;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({ lineLabel }) => {
  return (
    <div className="flex flex-row items-center gap-2 ml-auto">
      {/* Usar IconButton para la navegación hacia la izquierda */}
      <IconButton direction="back" className="text-gray-500" /> {/* Flecha izquierda gris */}

      {/* Etiqueta de la línea sin salto de línea */}
      <span className="text-blue-900 font-raleway text-[11pt] w-full whitespace-nowrap">
        {lineLabel}
      </span>

      {/* Usar IconButton para la navegación hacia la derecha */}
      <IconButton direction="forward" className="text-blue-900" /> {/* Flecha derecha azul */}
    </div>
  );
};

export default NavigationControls;
