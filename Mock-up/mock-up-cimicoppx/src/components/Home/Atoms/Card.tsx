import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="border rounded-lg shadow-sm p-4 bg-white">
      <h3 className="text-blue-800 font-semibold mb-2">{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default Card;
