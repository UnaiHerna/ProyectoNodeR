import Footer from "../Moleculs/Footer";
import LocationSelector from "../Moleculs/location";
import Dashboard from "../Organism/Dashboard";
import NavBar_ from "../Organism/navbar";

export default function Body() {
  return (
    <>
      <NavBar_ />
      <section className="bg-cimico mt-1 w-13 h-auto">
        <LocationSelector />
      </section>
      <section>
        <Dashboard />
      </section>
      <Footer />  
    </>
  );
}
