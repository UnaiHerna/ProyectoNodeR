import React from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import CustomLineChart from "../dashBorad/customLinechart";
import { Switch } from "@nextui-org/react"; // Asegúrate de que esta importación es correcta
import { HiArrowSmLeft, HiArrowSmRight } from "react-icons/hi"; // Importa los íconos necesarios

interface ChartCardProps {
  variable: string; // Solo recibir la variable como string
  onToggle: () => void; // Función para manejar el cambio del switch
}

const ChartCard: React.FC<ChartCardProps> = ({ variable, onToggle }) => {
  return (
    <Card shadow="sm" className="cursor-pointer h-full w-full">
      <CardBody className="overflow-visible p-0 scale-75">
        <CustomLineChart
          variable={variable as "NH4" | "NH4_FILT" | "DO_SP" | "DO"} // TypeScript type casting si es necesario
        />
      </CardBody>
      <CardFooter className="text-small flex items-center">
        <div className="flex w-full justify-between">
          <span>{variable}</span>
          <Switch
            size="sm"
            color="primary"
            onChange={onToggle} // Llama a la función onToggle cuando el switch cambie
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <HiArrowSmRight className={className} size={16} />
              ) : (
                <HiArrowSmLeft className={className} size={16} />
              )
            }
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChartCard;
