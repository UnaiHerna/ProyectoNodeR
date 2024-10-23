import {
  Card,
  CardBody,
  CardFooter,
  Select,
  SelectItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Switch,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import CustomLineChart from "../dashBorad/customLinechart";
import { HiArrowSmLeft, HiArrowSmRight } from "react-icons/hi";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

type VariableType = "NH4" | "NH4_FILT" | "DO_SP" | "DO";

const DragDropBoard: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [lineColor, setLineColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState<number>(2);
  const [lineStyle, setLineStyle] = useState<"solid" | "dashed" | "dotted">("solid");
  const [data, setData] = useState<{ variable: VariableType; id: string; enabled: boolean }[]>([]);
  const [selectedVariables, setSelectedVariables] = useState<VariableType[]>([]);

  const handleChartClick = () => {
    onOpen(); // Open modal on chart click
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return; // No movement
    }

    const newData = Array.from(data);
    const [removed] = newData.splice(source.index, 1);
    newData.splice(destination.index, 0, removed);

    setData(newData);
  };

  const handleAddVariables = () => {
    const newItems = selectedVariables.map((variable, index) => ({
      variable,
      id: `chart-${data.length + index + 1}`, // Generate unique id for each chart
      enabled: true, // Initialize with enabled state
    }));
    setData((prevData) => [...prevData, ...newItems]);
    setSelectedVariables([]);
  };

  const toggleChartEnabled = (id: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  return (
    <div className="title flex flex-col w-full">
      <Select
        label="Select Variables"
        placeholder="Select variables to add"
        selectionMode="multiple"
        className="max-w-xs mb-4"
        onSelectionChange={(keys) => {
          // Check if keys is a Set or an array
          const selectedValues: VariableType[] = Array.isArray(keys)
            ? keys as VariableType[]
            : [...keys] as VariableType[]; // Convert to array if it's a Set

          // Filter valid VariableTypes
          const filteredVariables = selectedValues.filter((value) => {
            return ["NH4", "NH4_FILT", "DO_SP", "DO"].includes(value);
          }) as VariableType[];

          setSelectedVariables(filteredVariables);
        }}
      >
        {["NH4", "NH4_FILT", "DO_SP", "DO"].map((variable) => (
          <SelectItem key={variable} value={variable}>
            {variable}
          </SelectItem>
        ))}
      </Select>
      <Button onClick={handleAddVariables} color="primary" disabled={selectedVariables.length === 0}>
        Add Selected Variables
      </Button>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="bg-gray-100 rounded-lg p-4 flex flex-col w-full"
            >
              {data.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mb-2"
                    >
                      <Card shadow="sm" className="cursor-pointer h-full w-full">
                        <CardBody
                          className="overflow-visible p-0 scale-75"
                          onClick={handleChartClick}
                        >
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
                              onChange={() => toggleChartEnabled(item.id)}
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
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">Line Configuration</h2>
              </ModalHeader>
              <ModalBody className="grid grid-cols-1 md:grid-cols-1 gap-10">
                {/* Line Color */}
                <div className="flex items-center">
                  <label htmlFor="colorPicker" className="mr-2 text-lg mt-1">
                    Color
                  </label>
                  <input
                    type="color"
                    id="colorPicker"
                    value={lineColor}
                    onChange={(e) => setLineColor(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Line Width */}
                <div className="flex flex-col">
                  <label className="text-lg mt-1">Line Width</label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={lineWidth}
                    onChange={(e) => setLineWidth(Number(e.target.value))}
                  />
                </div>

                {/* Line Style */}
                <div className="flex flex-row w-full justify-between">
                  <Select
                    label="Line Style"
                    placeholder="Select a line style"
                    onSelectionChange={(value) => {
                      // Ensure proper conversion from SharedSelection to string
                      const selectedStyle = typeof value === 'string' ? value : (value as Set<string>).values().next().value;
                      setLineStyle(selectedStyle as "solid" | "dashed" | "dotted"); // Use type assertion
                    }}
                    className="max-w-xs"
                  >
                    <SelectItem key="solid" value="solid">Solid</SelectItem>
                    <SelectItem key="dashed" value="dashed">Dashed</SelectItem>
                    <SelectItem key="dotted" value="dotted">Dotted</SelectItem>
                  </Select>
                </div>
              </ModalBody>

              <ModalFooter className="flex justify-end">
                <Button color="danger" variant="light" onPress={onClose} className="mr-2">
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Apply
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DragDropBoard;
