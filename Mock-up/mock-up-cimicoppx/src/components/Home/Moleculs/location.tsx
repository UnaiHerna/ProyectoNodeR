import { Select, SelectItem } from "@nextui-org/select";
import { FaLocationDot } from "react-icons/fa6";

// Sample data for EDARS
const EDARS = ["Ranilla WWTP"];

export default function LocationSelector() {
  return (
    <section className="flex items-center space-x-2 text-white bg-cimico p-2 gap-4">
      {/* Icono de localización con tamaño y color ajustados */}
      <FaLocationDot className="text-white w-5 h-5 ml-8" />
      
      {/* Componente Select */}
      <Select
        label="Favorite EDAR"
        placeholder="Select an EDAR"
        color="primary"
        size="sm"
        variant="bordered"
        className="w-48 text-white rounded-lg border-none text-sm p-2"
      >
        {/* Mapear EDARS para crear opciones de selección */}
        {EDARS.map((edar, index) => (
          <SelectItem key={index} value={edar} className="text-black">
            {edar}
          </SelectItem>
        ))}
      </Select>
    </section>
  );
}
