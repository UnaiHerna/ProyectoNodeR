import Footer from "../Moleculs/Footer";
import LocationSelector from "../Moleculs/location";
import NavegationPanel from "../Organism/Analytics/NavegationPanel";
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
      <NavBar />
      <section className="bg-cimico mt-1 w-full flex flex-row justify-between flex-shrink-0">
        <LocationSelector />
        <h2 className="font-roboto font-bold text-[12pt] text-center self-center text-white mr-[8rem]">
          {currentDate}
        </h2>
      </section>
      <section
        className="flex-grow grid grid-cols-1 md:grid-cols-6 overflow-hidden bg-red-200"
        id="grid_body"
      >
        <section
          className="col-span-1 bg-yellow-100 w-full h-full"
          id="control_section"
        >
          <div
            className="grid grid-cols-3 justify-center h-full w-full  bg-blue-500 p-2"
            id="control_panele_section"
          >
            <section
              className=" col-span-1 flex flex-col justify-center items-center w-full h-2/2 bg-slate-800"
              id="control_panele_section_1"
            >
             <NavegationPanel  />
            </section>
            <section
              className=" col-span-2 bg-fuchsia-500 flex flex-col justify-center items-center w-full h-2/2 p-3"
              id="control_panele_section_2"
            >
              sensors panel
            </section>
          </div>
        </section>
        <section
          className="bg-red-600 w-full h-full col-span-1 md:col-span-5 items-center flex flex-col"
          id="dashboard_Section"
        >
          <div className="w-full h-[7%] bg-green-500 flex flex-row justify-end gap-4 p-2" id="line_selector_section">
            <section className="h-96">Line 1</section>
            <section className="h-96">Line 2</section>
            <section className="h-96">Line 3</section>
            <section className="h-96">Line 4</section>
            <section>Effluent</section>
          </div>
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
