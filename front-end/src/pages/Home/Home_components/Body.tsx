import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Input } from "@nextui-org/react";
import Tarjetas from "./nexUI/Tarjetas";
import SelectUI from "./nexUI/select";
import { tarjetasData } from "../../../hooks/tarjetasData";

const Body: React.FC = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/gestionar-planta');
  };
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const filteredTarjetas = tarjetasData.filter((tarjeta) => {
    const matchesSearchTerm =
      tarjeta.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tarjeta.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tarjeta.address.toLowerCase().includes(searchTerm.toLowerCase());
  
    const matchesStatus =
      selectedStatus.length === 0 || selectedStatus.includes('all') || selectedStatus.includes(tarjeta.status);
  
    // Return true if both search term and status match
    return matchesSearchTerm && matchesStatus;
  });

  return (
    <div className="p-8 w-full pt-24">
      <div className="flex flex-row w-full justify-between pb-4">
        <h1 className="text-black font-pt-sans text-2xl font-bold leading-normal self-end">Machine List</h1>
        <ul className="flex flex-row-reverse gap-4">
          <Input
            type="text"
            label="Buscar..."
            isClearable
            value={searchTerm}
            className="w-12/12 h-11"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SelectUI
            selectedStatus={selectedStatus}
            onChange={setSelectedStatus} // Ensure this is correctly updating state
          />
        </ul>
      </div>

      <div className="w-full gap-3 grid md:grid-cols-2 lg:grid-cols-3 grid-rows-2">
        {filteredTarjetas.length > 0 ? (
          filteredTarjetas.map((tarjeta, index) => (
            <Tarjetas
              key={index}
              title={tarjeta.title}
              subtitle={tarjeta.subtitle}
              address={tarjeta.address}
              buttonText={tarjeta.buttonText}
              imageUrl={tarjeta.imageUrl}
              iconUrl={tarjeta.iconUrl}
              handleButtonClick={handleButtonClick}
            />
          ))
        ) : (
          <p>No se encontraron resultados</p>
        )}
      </div>
    </div>
  );
};

export default Body;

  