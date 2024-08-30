import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import N_NH4TrainBody from "../N_NH4TrainBody";

export default function TrainCrad() {
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options" className="self-end">
        <Tab key="N-NH4" title="N-NH4">
          <Card className="bg-transparent shadow-none">
            <CardBody className="w-full h-full bg-transparent border-none mt-[-1rem]">
              <N_NH4TrainBody />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="N-NO3" title="N-NO3">
          <Card className="bg-transparent shadow-none">
            <CardBody className="bg-transparent">N-NO3</CardBody>
          </Card>
        </Tab>
        <Tab key="MLSS" title="MLSS">
          <Card className="bg-transparent shadow-none">
            <CardBody className="bg-transparent">MLSS</CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
