import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import Tarjetas from "./nexUI/Tarjetas";

const Body: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Listado de datos de tarjetas
  const tarjetasData = [
    {
      title: "EDAR Ranilla",
      subtitle: "EDAR Ranilla",
      address: "Calle Teodoro Murua, 20500,1C....",
      buttonText: "Gestionar Planta",
      imageUrl: "https://www.retema.es/sites/default/files/styles/imagen_contenido_ampliado/public/2022-07/eEtcKxBuiKPzy5JzmOeXqVkawLr6FICI9kP.jpg.webp?itok=eCVv0Mdi",
      iconUrl: "/online.png",
    },
    {
      title: "EDAR Sedatez",
      subtitle: "EDAR Sedatez",
      address: "Calle Teodoro Murua, 20500,1C....",
      buttonText: "Gestionar Planta",
      imageUrl: "https://www.residuosprofesional.com/wp-content/uploads/2020/09/edar.jpg",
      iconUrl: "/online.png",
    },
    // Añade más tarjetas aquí
  ];

  // Filtrar las tarjetas basándose en el término de búsqueda
  const filteredTarjetas = tarjetasData.filter((tarjeta) =>
    tarjeta.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tarjeta.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tarjeta.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 w-full">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page</h1>

      {/* Input del buscador usando NextUI */}
      <Input
        isClearable
        underlined
        placeholder="Buscar planta..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
        width="100%"
      />

      <div className="w-full gap-2 grid md:grid-cols-2 lg:grid-cols-3 grid-rows-2 px-8">
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
