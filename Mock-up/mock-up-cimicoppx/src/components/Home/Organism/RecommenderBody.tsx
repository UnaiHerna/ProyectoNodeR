import React, { useState } from "react";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { IoMdCheckboxOutline } from "react-icons/io";
import { TbTriangleInverted } from "react-icons/tb";
import Card from "../Atoms/Card";

interface Option {
  label: string;
  checked: boolean;
  subOptions?: Option[];
}

const OptimizationSpecifications: React.FC = () => {
  const [optimizationOptions, setOptimizationOptions] = useState<Option[]>([
    { label: "Total inorganic nitrogen", checked: false },
    { label: "Oxygen requirements", checked: false },
    { label: "Sludge production", checked: true },
  ]);

  const [specificationOptions, setSpecificationOptions] = useState<Option[]>([
    {
      label: "Influent load",
      checked: true,
      subOptions: [{ label: "Dry season", checked: true }],
    },
    {
      label: "Water temperature",
      checked: false,
    },
  ]);

  const handleCheckboxChange = (index: number, isOptimization: boolean) => {
    const updateOptions = isOptimization ? [...optimizationOptions] : [...specificationOptions];
    updateOptions[index].checked = !updateOptions[index].checked;

    if (isOptimization) {
      setOptimizationOptions(updateOptions);
    } else {
      setSpecificationOptions(updateOptions);
    }
  };

  const renderOptions = (options: Option[], isOptimization: boolean) => (
    <ul className="space-y-1">
      {options.map((option, index) => (
        <li key={index} className="flex items-center space-x-2">
          <div
            onClick={() => handleCheckboxChange(index, isOptimization)}
            style={{
              color: option.checked ? "#FBBE30" : "#D1D5DB", // Color del checkbox cuando está seleccionado o no
            }}
            className="cursor-pointer"
          >
            {option.checked ? (
              <IoMdCheckboxOutline size={20} />
            ) : (
              <MdOutlineCheckBoxOutlineBlank size={20} />
            )}
          </div>
          <label
            style={{
              color: option.checked ? "#000000" : "#7F7F7F", // Color del texto cuando el checkbox está seleccionado o no
            }}
          >
            {option.label}
          </label>
          {option.subOptions && (
            <ul className="ml-6">{renderOptions(option.subOptions, isOptimization)}</ul>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="grid grid-cols-3 gap-8 p-4">
      <section className="flex flex-col space-y-4">
        <Card
          title={
            <h3 className="text-lg p-2 font-raleway text-[11pt] text-[#132568] flex flex-row gap-4">
              <TbTriangleInverted className="self-center text-center text-[#FBBE30]" />
              What-if scenarios
            </h3>
          }
        >
          {renderOptions(optimizationOptions, true)}
        </Card>
        <Card
          title={
            <h3 className="text-lg font-raleway text-[11pt] text-[#132568] flex flex-row gap-4">
              Specifications
            </h3>
          }
        >
          {renderOptions(specificationOptions, false)}
        </Card>
      </section>
      <div className="col-span-2 p-4 border rounded-sm shadow-lg bg-white">
        {/* Aquí puedes agregar el gráfico o la imagen que quieras incluir */}
        <h3 className="text-lg font-semibold text-[#132568]"></h3>
        {/* Suponiendo que el gráfico sea una imagen o un componente de gráfico */}
        <img
          src="/abacos.jpg"
          alt="Gráfico de producción de lodo"
          className="w-full mt-2"
        />
      </div>
    </div>
  );
};

export default OptimizationSpecifications;
