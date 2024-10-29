import { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';

const SummaryCard = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  const handleMouseEnter = (topic: string) => {
    setHovered(topic);
  };

  const handleMouseLeave = () => {
    setHovered(null);
  };

  // Función para calcular el desplazamiento de `translate-y` del icono
  const getIconTranslate = () => {
    switch (hovered) {
      case 'SUMMARY':
        return 'translate-y-[0.3rem]'; // Posición inicial
      case 'DATA ANALYTICS':
        return 'translate-y-[2rem]'; // Ajuste para el segundo elemento
      case 'RECOMMENDER':
        return 'translate-y-[3.8rem]'; // Ajuste para el tercer elemento
      case 'TRAINING':
        return 'translate-y-[5.5rem]'; // Ajuste para el cuarto elemento
      default:
        return 'translate-y-[0.3rem]'; // Posición por defecto
    }
  };

  return (
    <div className="border rounded-lg shadow-lg p-4 w-[15rem] h-[16rem] relative">
      <div className="flex justify-end">
        <GiHamburgerMenu className="text-red-500 text-2xl" />
      </div>

      <div className="flex mt-4">
        <div className="flex flex-col items-center mr-4 relative">
          <GiHamburgerMenu
            className={`text-red-500 text-xl transition-transform duration-300 absolute ${getIconTranslate()}`}
          />
          <div className="border-l-2 border-red-500 h-32 absolute"></div>
        </div>

        <div>
          <p
            className={`font-bold text-xl cursor-pointer ${hovered === 'SUMMARY' ? 'text-red-500' : 'text-gray-500'}`}
            onMouseEnter={() => handleMouseEnter('SUMMARY')}
            onMouseLeave={handleMouseLeave}
          >
            SUMMARY
          </p>
          <p
            className={`font-bold text-xl cursor-pointer ${hovered === 'DATA ANALYTICS' ? 'text-red-500' : 'text-gray-500'}`}
            onMouseEnter={() => handleMouseEnter('DATA ANALYTICS')}
            onMouseLeave={handleMouseLeave}
          >
            DATA ANALYTICS
          </p>
          <p
            className={`font-bold text-xl cursor-pointer ${hovered === 'RECOMMENDER' ? 'text-red-500' : 'text-gray-500'}`}
            onMouseEnter={() => handleMouseEnter('RECOMMENDER')}
            onMouseLeave={handleMouseLeave}
          >
            RECOMMENDER
          </p>
          <p
            className={`font-bold text-xl cursor-pointer ${hovered === 'TRAINING' ? 'text-red-500' : 'text-gray-500'}`}
            onMouseEnter={() => handleMouseEnter('TRAINING')}
            onMouseLeave={handleMouseLeave}
          >
            TRAINING
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
