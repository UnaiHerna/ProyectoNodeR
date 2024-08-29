import React from "react";
import { Card, CardHeader, CardFooter, Image, Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

// Define la interfaz para las props
interface TarjetasProps {
  title: string;
  subtitle: string;
  address: string;
  buttonText: string;
  imageUrl: string;
  iconUrl: string;
  handleButtonClick: ()=> void;
}
const bas_url = "/gestionar-planta/";

const Tarjetas: React.FC<TarjetasProps> = ({
  title,
  subtitle,
  address,
  buttonText,
  imageUrl,
  iconUrl,
}) => {
  return (
    <div >
      <Link to={bas_url + title.replace(" ", "_")}>
      <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-7 relative shadow-md">
        <CardHeader className="absolute z-10 top-1 flex-col items-start">
          <p className="text-tiny text-white/60 uppercase font-bold">{title}</p>
          <h4 className="text-white/90 font-medium text-xl">{subtitle}</h4>
        </CardHeader>
        <Image
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src={imageUrl}
          />
        <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100 flex items-center justify-between p-4">
          <div className="flex gap-2 items-center">
            <Image
              alt="Icon"
              className="rounded-full w-15 h-6 bg-transparent"
              src={iconUrl}
              />
            <div className="flex flex-col">
              <p className="text-tiny text-white/90 font-semibold">{title}</p>
              <p className="text-tiny text-white/60">{address}</p>
            </div>
          </div>
          <Button radius="full" className="bg-botonColor text-white" size="sm">{buttonText}</Button>
        </CardFooter>
      </Card>
      </Link>
    </div>
  );
}

export default Tarjetas;
