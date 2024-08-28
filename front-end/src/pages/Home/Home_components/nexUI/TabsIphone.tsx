import { Tabs, Tab, Card } from "@nextui-org/react";

export default function TabsIphone() {
  return (
    <div className="flex w-full h-10 flex-col items-center">
      <Tabs aria-label="Options" color="primary" variant="light" className="w-full">
        <Tab
          key="N-NH4"
          title="N-NH4"
          className="nextui-tabs-tab" // Apply the custom tab styles
        >
          <Card>
            {/* Contenido para N-NH4 */}
          </Card>
        </Tab>
        <Tab
          key="N-NO3"
          title="N-NO3"
          className="nextui-tabs-tab text-white" // Apply the custom tab styles
        >
          <Card>
            {/* Contenido para N-NO3 */}
          </Card>
        </Tab>
        <Tab
          key="MLSS"
          title="MLSS"
          className="nextui-tabs-tab" // Apply the custom tab styles
        >
          <Card>
            {/* Contenido para MLSS */}
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
