import React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { Link } from "react-router-dom";

// Importa los íconos de react-icons
import { PiWifiXBold } from "react-icons/pi";
import { PiWifiSlashLight } from "react-icons/pi";
import { MdSignalWifiStatusbarConnectedNoInternet2 } from "react-icons/md";
import { FiWifi } from "react-icons/fi";

// Define la interfaz para las props
interface TarjetasProps {
  title: string;
  subtitle: string;
  address: string;
  buttonText: string;
  imageUrl: string;
  iconType: string;  // Cambiado de iconUrl a iconType para manejar íconos de react-icons
  handleButtonClick: () => void; // Mantenemos handleButtonClick
}

const bas_url = "/gestionar-planta/";

const Tarjetas: React.FC<TarjetasProps> = ({
  title,
  subtitle,
  address,
  buttonText,
  imageUrl,
  iconType, // Recibe el tipo de ícono
  handleButtonClick, // Asegúrate de recibirlo como prop
}) => {
  // Función para renderizar el ícono según el tipo recibido
  const renderIcon = (type: string) => {
    switch (type) {
      case "PiWifiXBold":
        return <PiWifiXBold className="w-10 h-10 mr-2" />;
      case "PiWifiSlashLight":
        return <PiWifiSlashLight className="w-10 h-10 mr-2" />;
      case "MdSignalWifiStatusbarConnectedNoInternet2":
        return <MdSignalWifiStatusbarConnectedNoInternet2 className="w-10 h-10 mr-2" />;
      case "FiWifi":
        return <FiWifi className="w-10 h-10 mr-2" />;
      default:
        return null; // Retorna null si no coincide
    }
  };

  return (
    <Link to={bas_url + title.replace(" ", "_")}>
      <Card shadow="sm" className="relative overflow-hidden h-full bg-gray-100">
        <CardBody className="overflow-visible p-0">
          <Image
           isBlurred
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
            {/* Renderiza el ícono en lugar de la imagen */}
            {renderIcon(iconType)}
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
