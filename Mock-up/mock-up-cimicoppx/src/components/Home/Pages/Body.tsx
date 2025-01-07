import Footer from "../Moleculs/Footer";
import LocationSelector from "../Moleculs/location";
import Dashboard from "../Organism/Dashboard";
import NavBar_ from "../Organism/navbar";

export default function Body() {
  // Obtenemos la fecha actual y la formateamos
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col h-screen bg-red-100 sm:bg-red-300 md:bg-red-500 lg:bg-red-700 xl:bg-red-900 2xl:bg-orange-400">
      <NavBar_ />
      <section className="bg-cimico mt-1 sm:mt-1 md:mt-1 lg:mt-1 xl:mt-1 2xl:mt-1  w-full h-auto flex flex-row justify-between">
        <LocationSelector />
        <h2 className="font-roboto font-bold text-[12pt] text-center self-center text-white mr-[8rem]">
          {currentDate}
        </h2>
      </section>
      <section className="h-screen mt-5">
        <Dashboard />
      </section>
      <Footer />
    </div>
  );
}
