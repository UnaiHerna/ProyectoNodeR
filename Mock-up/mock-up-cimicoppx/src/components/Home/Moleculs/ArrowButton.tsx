import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

type ArrowButtonProps = {
  onClick?: () => void;
};

const ArrowButton: React.FC<ArrowButtonProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick} 
      style={{
        backgroundColor: '#4da6ff', // Color azul claro
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <FaArrowLeft color="#ffffff" size={16} />
    </button>
  );
};

export default ArrowButton;
