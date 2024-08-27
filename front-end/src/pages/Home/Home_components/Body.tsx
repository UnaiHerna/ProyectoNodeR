import {
  Tab,
  Tabs,
} from "@nextui-org/react";
export const Body = () => {
  return (
    <div className="w-auto h-screen">
      <section className="flex flex-row-reverse justify-between w-full">
        <ul>
          <li>Machine List</li>
        </ul>
        <ul className="flex flex-row-reverse w-4/12 gap-4 z-0">
          <li className="self-center mt-2 w-full">
            <Tabs aria-label="Options">
              <Tab key="Mapa0" title="Mapa 0"></Tab>
              <Tab key="Mapa1" title="Mapa 1 "></Tab>
              <Tab key="Mapa2" title="Mapa 2 "></Tab>
              <Tab key="Mapa3" title="Mapa 3 "></Tab>
              <Tab key="Mapa4" title="Mapa 4 "></Tab>
              <Tab key="Mapa5" title="Mapa 5 "></Tab>
            </Tabs>
          </li>
        </ul>
      </section>
    </div>
  );
};
