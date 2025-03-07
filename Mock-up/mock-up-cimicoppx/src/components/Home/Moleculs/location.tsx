import { Select, Space } from "antd";
import { FaLocationDot } from "react-icons/fa6";
import "../../../estilos.css";
const EDARS = ["Ranilla WWTP"];

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

export default function LocationSelector() {
  return (
    <section className="flex items-center text-white bg-cimico p-2 gap-4 ml-[1.3rem] ">
      {/* Icono de localización con tamaño y color ajustados */}
      <FaLocationDot className="text-white w-5 h-5" />

      {/* Selector de EDARS usando Ant Design */}
        <Space wrap>
          <Select
            className="bg-transparent text-white font-raleway text-[17pt]"
            defaultValue={EDARS[0]}
            style={{ width: 180, borderRadius: "1.5rem", color: "white" , fontFamily:"Raleway", animation:"backwards", font:"caption"}} // Adjust the borderRadius here
            onChange={handleChange}
            options={EDARS.map((edar) => ({
              value: edar,
              label: edar,
            }))}
            placeholder="Select an EDAR"
          />
        </Space>
    </section>
  );
}
