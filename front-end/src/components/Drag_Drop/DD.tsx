import React from "react";
import { HiAdjustmentsVertical } from "react-icons/hi2";
import { Card, CardFooter, CardBody } from "@nextui-org/react";
import { TbAxisY } from "react-icons/tb";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Switch,
} from "@nextui-org/react";

import CustomLineChart from "../dashBorad/customLinechart";

type VariableType = "NH4" | "NH4_FILT" | "DO_SP" | "DO";
interface Props {
  sens: VariableType;
}

const DragDropBoard: React.FC<Props> = ({ sens = "DO" }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="title flex w-52">
      <Card shadow="sm" className="cursor-pointer h-full w-full">
        <CardBody className="overflow-visible p-0 scale-75 h-[5rem]">
          <CustomLineChart variable={sens} />
        </CardBody>
        <CardFooter className="text-small justify-end h-[2rem] flex items-center space-x-2">
          <b className="mr-auto">Do Sens</b>
          <Button
            className="bg-transparent w-6 h-6 p-0 flex items-center justify-center"
            onPress={onOpen}
          >
            <HiAdjustmentsVertical size={16} />
          </Button>
        </CardFooter>
      </Card>

      {/* Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
              <Switch
            defaultSelected
            size="sm"
            color="primary"
            className="w-6 h-6"
            thumbIcon={({ isSelected }) =>
              isSelected ? <TbAxisY size={12} /> : <TbAxisY size={12} />
            }
          />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
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
