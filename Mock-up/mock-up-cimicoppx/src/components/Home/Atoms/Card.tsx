import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string; // Prop opcional para la clase personalizada
}

const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={`border rounded-sm shadow-sm p-4 bg-white ${className}`}>
      <h3 className="text-blue-800 font-semibold mb-2">{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default Card;
