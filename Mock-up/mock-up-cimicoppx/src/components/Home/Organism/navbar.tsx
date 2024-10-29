import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import cimicoLogo from "/logo-cimico.png";
import { Link, useLocation } from "react-router-dom"; // Import useLocation to determine the current route

export default function NavBar_() {
    const navegationsList = ["Summary", "Analytics", "Recommender", "Training"];
    const location = useLocation(); // Get the current location

    return (
        <Navbar className="bg-cimico flex justify-between items-center">
            <div className="flex items-center gap-20">
                <NavbarBrand className="flex items-center">
                    <section className="h-[2rem] w-[3rem]">
                        <img src={cimicoLogo} alt="Cimico Logo" className="w-full h-full" />
                    </section>
                </NavbarBrand>

                <NavbarContent className="hidden sm:flex gap-4">
                    {navegationsList.map((nav, index) => (
                        <NavbarItem 
                            key={index} 
                            className="flex relative h-full items-center"
                        >
                            <Link to={`/${nav.toLowerCase()}`} className="text-white">
                                <p className={`${index === 0 ? "text-white" : "text-cimicoText"} font-lato text-[17.33px]`}>
                                    {nav}
                                </p>
                            </Link>
                            {/* Pseudo-element for active state */}
                            <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-[2px] bg-primary transition-all duration-300 ${location.pathname === `/${nav.toLowerCase()}` ? 'block' : 'hidden'}`}></span>
                        </NavbarItem>
                    ))}
                </NavbarContent>
            </div>

            <NavbarContent justify="end">
                {/* Puedes agregar contenido aquí si es necesario */}
            </NavbarContent>
        </Navbar>
    );
}
