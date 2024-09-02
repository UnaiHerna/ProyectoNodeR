import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import N_NH4TrainBody from "../N_NH4TrainBody";
import DataDisplay from "../../DataDisplay";
import HeatmapChart from "../HeatMap";

export default function TrainCrad() {
  return (
    <div className="flex w-full flex-col h-full">
      <Tabs aria-label="Options" className="flex-1 self-end">
        <Tab key="N-NH4" title="N-NH4">
          <Card className="bg-transparent shadow-none">
            <CardBody className="w-full h-full bg-transparent border-none p-0">
              <N_NH4TrainBody />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="N-NO3" title="N-NO3">
          <Card className="bg-transparent shadow-none">
            <CardBody className="bg-transparent p-0">N-NO3</CardBody>
          </Card>
        </Tab>
        <Tab key="MLSS" title="MLSS">
          <Card className="bg-transparent shadow-none">
            <CardBody className="bg-transparent p-0">MLSS</CardBody>
          </Card>
        </Tab>
        <Tab key="HeatMap" title="HeatMap">
          <Card className="bg-transparent shadow-none">
            <CardBody className="bg-transparent p-0">
              <HeatmapChart />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="AI" title="AI🌟">
          <Card className="bg-transparent shadow-none">
            <CardBody className="bg-transparent p-0">
              <DataDisplay />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
