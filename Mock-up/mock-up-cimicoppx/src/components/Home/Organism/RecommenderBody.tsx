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
      checked: true,
      subOptions: [{ label: "21.0 °C", checked: false }],
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
    <ul className="space-y-2 p-4">
      {options.map((option, index) => (
        <li key={index} className="flex flex-col space-y-1">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleCheckboxChange(index, isOptimization)}
          >
            <div
              style={{
                color: option.checked ? "#FBBE30" : "#D1D5DB", // Checkbox color
              }}
            >
              {option.checked ? (
                <IoMdCheckboxOutline size={20} />
              ) : (
                <MdOutlineCheckBoxOutlineBlank size={20} />
              )}
            </div>
            <label
              style={{
                color: option.checked ? "#132568" : "#7F7F7F", // Text color based on checked state
                fontWeight: option.checked ? "normal" : "normal",
              }}
            >
              {option.label}
            </label>
          </div>
          {option.subOptions && (
            <ul className="ml-6 pl-4 font-raleway text-[10pt] text-sm text-[#132568]">
              {option.subOptions.map((subOption, subIndex) => (
                <li key={subIndex} className="flex items-center space-x-2">
                  <TbTriangleInverted className="text-[#FBBE30]" />
                  <span>{subOption.label}</span>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-12 p-4 mt-5 w-[97vw] h-[80vh]">
      {/* Left column with options */}
      <section className="flex flex-col space-y-4 px-5 flex-3 h-full">
        <Card
          title={
            <h3 className="text-lg mb-2 font-raleway text-[11pt] text-[#132568] flex flex-row gap-4">
              <TbTriangleInverted className="self-center text-center text-[#FBBE30]" />
              What-if scenarios 
            </h3>
          }
          className="self-center w-full"
        >
          {renderOptions(optimizationOptions, true)}
        </Card>
        
        {/* Specifications Card */}
        <Card
          title={
            <h3 className="text-lg mb-2 font-raleway text-[11pt] text-[#132568] flex flex-row gap-4">
              Specifications
            </h3>
          }
          className="self-center w-full"
        >
          {renderOptions(specificationOptions, false)}
        </Card>
      </section>

      {/* Right column with the chart */}
      <div className="flex-1 p-0 m-0 bg-transparent h-full w-full">
        <img
          src="/abacos.jpg"
          alt="Gráfico de producción de lodo"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default OptimizationSpecifications;
