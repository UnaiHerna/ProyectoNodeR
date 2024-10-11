import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import DataDisplay from "../../DataDisplay";

interface PropsEvent {
  title: string;
  img: string;
  price: string;
}

export default function CardAi() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCard, setSelectedCard] = React.useState<PropsEvent | null>(null);

  const list: PropsEvent[] = [
    {
      title: "Java",
      img: "/java.webp",
      price: "Online",
    },
    {
      title: "R",
      img: "/r.jpg",
      price: "Online",
    },
    {
      title: "Python",
      img: "/python_.webp",
      price: "Online",
    },
  ];

  const handleCardClick = (item: PropsEvent) => {
    setSelectedCard(item);
    onOpen();
  };

  return (
    <>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {list.map((item, index) => (
          <Card shadow="sm" key={index} isPressable onPress={() => handleCardClick(item)}>
            <CardBody className="overflow-visible p-2">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt={item.title}
                className="w-full object-cover h-[140px]"
                src={item.img}
              />
            </CardBody>
            <CardFooter className="text-small justify-between">
              <b>{item.title}</b>
              <p className="text-default-500">{item.price}</p>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedCard && (
        <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" size="5xl" scrollBehavior="inside">
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1"><Image src={selectedCard.img} alt={selectedCard.title} className="w-20" /></ModalHeader>
            <ModalBody>
                <DataDisplay titulo={selectedCard.title}/>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
              Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
