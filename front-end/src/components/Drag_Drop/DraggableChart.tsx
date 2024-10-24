import { Card, CardBody, CardFooter, Switch } from "@nextui-org/react";
import CustomLineChart from "../dashBorad/customLinechart"; // Asegúrate de que la ruta sea correcta
import { HiArrowSmLeft, HiArrowSmRight } from "react-icons/hi";

type VariableType = "NH4" | "NH4_FILT" | "DO_SP" | "DO";

interface DraggableChartProps {
  item: { variable: VariableType; id: string; enabled: boolean };
  lineColor: string;
  lineWidth: number;
  lineStyle: "solid" | "dashed" | "dotted";
  handleChartClick: () => void;
  toggleChartEnabled: (id: string) => void;
}

const DraggableChart: React.FC<DraggableChartProps> = ({
  item,
  lineColor,
  lineWidth,
  lineStyle,
  handleChartClick,
  toggleChartEnabled,
}) => {
  return (
    <Card shadow="sm" className="cursor-pointer h-full w-full">
      <CardBody className="overflow-visible p-0 scale-75" onClick={handleChartClick}>
        {item.enabled && (
          <CustomLineChart
            variable={item.variable}
            lineColor={lineColor}
            lineWidth={lineWidth}
            lineStyle={lineStyle}
          />
        )}
      </CardBody>
      <CardFooter className="text-small flex items-center">
        <div className="flex w-full justify-between">
          <span>{item.variable}</span>
          <Switch
            size="sm"
            color="primary"
            isSelected={item.enabled}
            onChange={() => toggleChartEnabled(item.id)} // Cambia el estado habilitado al hacer clic
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

export default DraggableChart;
