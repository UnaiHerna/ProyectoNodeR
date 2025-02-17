import Footer from "../Moleculs/Footer";
import LocationSelector from "../Moleculs/location";
import NavegationPanel from "../Organism/Analytics/NavegationPanel";
import SideNav from "../Organism/Analytics/SideNav";
import NavBar from "../Organism/navbar";

export default function Analytics() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar section */}
      <NavBar />
      {/* Location selector and date section */}
      <section className="bg-cimico mt-1 w-full flex flex-row justify-between flex-shrink-0">
        <LocationSelector />
        <h2 className="font-roboto font-bold text-[12pt] text-center self-center text-white mr-[8rem]">
          {currentDate}
        </h2>
      </section>
      {/* Main content section */}
      <section
        className="flex-grow grid grid-cols-1 md:grid-cols-6 overflow-hidden bg-red-200"
        id="grid_body"
      >
        {/* Control sensors panel section */}
        <section
          className="col-span-1 bg-white w-full h-full"
          id="control_section"
        >
            <div
            className="grid grid-cols-12 h-full w-full bg-white pl-1.5"
            id="control_panele_section"
            >
            <section
              className="col-span-3 flex flex-col justify-center items-center bg-[#ff0000]"
              id="control_panel_section_1"
            >
              <NavegationPanel />
            </section>
            {/* Sensor panel dropdown */}
            <section
              className="col-span-9 bg-white p-2 shadow-[13px_13px_8px_-7px_#a8a8a8] border-gray-50 border-2"
              id="control_panel_section_2"
            >
              <SideNav />
            </section>
            </div>
        </section>
        {/* Dashboard section */}
        <section
          className="bg-red-600 w-full h-full col-span-1 md:col-span-5 items-center flex flex-col"
          id="dashboard_Section"
        >
          {/* Line selector section */}
          <div className="w-full h-[7%] bg-green-500 flex flex-row justify-end gap-4 p-2" id="line_selector_section">
            <section className="h-96">Line 1</section>
            <section className="h-96">Line 2</section>
            <section className="h-96">Line 3</section>
            <section className="h-96">Line 4</section>
            <section>Effluent</section>
          </div>
          {/* Dashboard data section */}
          <div
            className="flex flex-col w-full h-full overflow-auto bg-yellow-800"
            id="dashboard_data_section"
          >
            <section className="w-full h-full bg-sky-400 grid grid-cols-6">
              <div className="w-full h-full col-span-4 bg-red-700">linechart</div>
              <div className="w-full h-full">barchart</div>
            </section>
            <section className="w-full h-full bg-teal-800">calendar</section>
          </div>
        </section>
      </section>
      <Footer />
    </div>
  );
}
