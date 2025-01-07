import { Link, useLocation } from "react-router-dom";
import { FaCog } from "react-icons/fa";
import cimicoLogo from "/logo-cimico.png";
import { FaCircleUser, FaRegBell } from "react-icons/fa6";

export default function NavBar() {
  const navigationsList = ["Today", "Analytics", "Recommender", "Training"];
  const location = useLocation();

  return (
    <nav className="bg-cimico flex justify-between items-center w-full p-4">
      {/* Left side with logo and navigation */}
      <div className="flex items-center gap-20 flex-grow">
        <div className="flex items-center">
          <img src={cimicoLogo} alt="Cimico Logo" className="h-8 w-auto" />
        </div>

        <div className="hidden sm:flex gap-8">
          {navigationsList.map((nav, index) => (
            <div key={index} className="relative flex items-center">
              <Link
                to={`/${nav.toLowerCase()}`}
                className={`text-base sm:text-sm md:text-medium lg:text-large xl:text-xl 2xl:text-xl font-lato ${
                  location.pathname === `/${nav.toLowerCase()}`
                    ? "text-white" // Color para el enlace activo
                    : "text-[#0070C0]" // Color gris para los enlaces no activos
                }`}
              >
                {nav}
              </Link>
              {/* Underline for active link */}
              <span
                className={`absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 h-[2px] transition-all duration-300 ${
                  location.pathname === `/${nav.toLowerCase()}`
                    ? "block bg-cimicoLine h-[4px] w-[2rem]"
                    : "hidden"
                }`}
              ></span>
            </div>
          ))}
        </div>
      </div>

      {/* Right side with icons, user info, and the new checkbox */}
      <div className="flex items-center gap-8 mr-32">
        <div className="relative mr-4">
          <FaRegBell className="text-white text-xl cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-[rgba(255,192,0,1)] text-black rounded-full px-1 text-xs font-bold">
            4
          </span>
        </div>
        <div className="flex items-center gap-4">
          <FaCog className="text-white text-xl cursor-pointer" />
          <FaCircleUser className="text-white text-4xl bg-black rounded-full cursor-pointer" />
          <span className="text-white font-lato">John Doe</span>
        </div>
      </div>
    </nav>
  );
}
