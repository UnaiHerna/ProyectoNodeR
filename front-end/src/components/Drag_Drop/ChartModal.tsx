import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    RadioGroup,
    Radio,
  } from "@nextui-org/react";
  
  interface ChartModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    lineColor: string;
    setLineColor: (color: string) => void;
    lineWidth: number;
    setLineWidth: (width: number) => void;
    lineStyle: "solid" | "dashed" | "dotted";
    setLineStyle: (style: "solid" | "dashed" | "dotted") => void;
  }
  
  const ChartModal: React.FC<ChartModalProps> = ({
    isOpen,
    onOpenChange,
    lineColor,
    setLineColor,
    lineWidth,
    setLineWidth,
    lineStyle,
    setLineStyle,
  }) => {
    return (
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
                  <RadioGroup
                    label="Line Style"
                    value={lineStyle}
                    onChange={(event) => setLineStyle(event.target.value as "solid" | "dashed" | "dotted")}
                  >
                    <Radio value="solid">Solid</Radio>
                    <Radio value="dashed">Dashed</Radio>
                    <Radio value="dotted">Dotted</Radio>
                  </RadioGroup>
                </div>
              </ModalBody>
  
              <ModalFooter className="flex justify-end">
                <Button color="primary" onPress={onClose}>
                  Apply
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };
  
  export default ChartModal;
  