import React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { Link } from "react-router-dom";

// Define la interfaz para las props
interface TarjetasProps {
  title: string;
  subtitle: string;
  address: string;
  buttonText: string;
  imageUrl: string;
  iconUrl: string;
  handleButtonClick: () => void; // Mantenemos handleButtonClick
}

const bas_url = "/gestionar-planta/";

const Tarjetas: React.FC<TarjetasProps> = ({
  title,
  subtitle,
  address,
  buttonText,
  imageUrl,
  iconUrl,
  handleButtonClick, // Asegúrate de recibirlo como prop
}) => {
  return (
    <Link to={bas_url + title.replace(" ", "_")}>
      <Card shadow="sm" className="relative overflow-hidden h-full bg-gray-100">
        <CardBody className="overflow-visible p-0">
          <Image
            shadow="sm"
            radius="lg"
            width="100%"
            alt={title}
            className="w-full object-cover h-[235px]"
            src={imageUrl}
          />
        </CardBody>
        <CardFooter className="text-small justify-between">
          <div className="flex items-center">
            <Image
              alt="Icon"
              src={iconUrl}
              className="rounded-full w-10 h-10 mr-2"
            />
            <div>
              <b>{title}</b>
              <p className="text-default-500">{subtitle}</p>
              <p className="text-default-500">{address}</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Evita que el clic en el botón active el evento del enlace
              handleButtonClick(); // Ahora puedes llamar a la función
            }}
            className="bg-botonColor text-white rounded-full py-1 px-3"
          >
            {buttonText}
          </button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default Tarjetas;
