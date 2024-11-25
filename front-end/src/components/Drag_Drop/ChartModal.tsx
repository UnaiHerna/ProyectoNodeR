import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    RadioGroup,
    Radio,
    useDisclosure,
  } from "@nextui-org/react";
  
  interface ChartModalProps {
  }
  
  const ChartModal: React.FC<ChartModalProps> = () => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    return (
      <>
      <Button onPress={onOpen}>Open Modal</Button>
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
                  />
                </div>
  
                {/* Line Style */}
                <div className="flex flex-row w-full justify-between">
                  <RadioGroup
                    label="Line Style"
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
      </>
    );
  };
  
  export default ChartModal;
  