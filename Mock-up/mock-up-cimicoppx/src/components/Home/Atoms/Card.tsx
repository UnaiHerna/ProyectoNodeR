import React, { ReactNode } from 'react';

interface CardProps {
  title: ReactNode;
  children: ReactNode;
  className?: string; // Prop opcional para la clase personalizada
}

const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={`border rounded-sm shadow-lg p-4 bg-white ${className}`}>
      {title}
      <hr></hr>
      <section>{children}</section>
    </div>
  );
};

export default Card;
