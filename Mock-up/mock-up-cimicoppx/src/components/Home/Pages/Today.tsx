import Footer from "../Moleculs/Footer";
import LocationSelector from "../Moleculs/location";
import Dashboard from "../Organism/Dashboard";
import NavBar from "../Organism/navbar";

export default function Today() {
  // Obtenemos la fecha actual y la formateamos
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col h-screen ">
      <NavBar />
      <section className="bg-cimico mt-1 w-full flex flex-row justify-between flex-shrink-0">
        <LocationSelector />
        <h2 className="font-roboto font-bold text-[12pt] text-center self-center text-white mr-[8rem]">
          {currentDate}
        </h2>
      </section>
      <section className="flex-grow overflow-hidden">
        <Dashboard />
      </section>
      <Footer />
    </div>
  );
}
