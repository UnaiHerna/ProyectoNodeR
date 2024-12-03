import React from "react";
import IconButton from "../Organism/IconButton";

type ArrowButtonProps = {
  onClick?: () => void;
  direction: "forward" | "back"; // New prop to control the icon direction
  className?: string;
};

const ArrowButton: React.FC<ArrowButtonProps> = ({ onClick, direction, className }) => {

  return (
    <section className={`p-[2px] bg-blue-500 rounded-full flex items-center justify-center text-white ${className}`}>
      <IconButton direction={direction} className="text-large" onClick={onClick}/>
    </section>
  );
};

export default ArrowButton;
