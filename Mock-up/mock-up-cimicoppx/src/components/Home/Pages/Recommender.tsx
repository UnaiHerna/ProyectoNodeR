import Footer from "../Moleculs/Footer";
import LocationSelector from "../Moleculs/location";
import NavBar_ from "../Organism/navbar";
import OptimizationSpecifications from "../Organism/RecommenderBody";

export default function Recommender() {
  // Obtenemos la fecha actual y la formateamos
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <NavBar_ />
      <section className="bg-cimico mt-1 w-13 h-auto flex flex-row justify-between">
        <LocationSelector />
        <h2 className="font-roboto font-bold text-[12pt] text-center self-center text-white mr-[8rem]">
          {currentDate}
        </h2>

      </section>
<section>
<OptimizationSpecifications/>
</section>
      <Footer />
    </>
  );
}
