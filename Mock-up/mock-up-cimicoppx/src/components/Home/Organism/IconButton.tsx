// IconButton.tsx
import React from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

interface IconButtonProps {
  onClick?: () => void;
  direction: "forward" | "back"; // New prop to control the icon direction
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, direction = "forward", className }) => {
  return (
    <button
      onClick={onClick}
      className={`flexitems-center rounded transition ${className}`}
    > 
    {/* cambios aqui */}
      {direction === "back" && <IoIosArrowBack className="text-[2rem] p-0 m-0"/>}
      {direction === "forward" && <IoIosArrowForward className="text-[2rem] p-0 m-0"/>}
    </button>
  );
};

export default IconButton;
