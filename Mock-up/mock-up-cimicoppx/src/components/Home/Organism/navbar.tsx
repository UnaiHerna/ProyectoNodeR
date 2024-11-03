import { Link, useLocation } from 'react-router-dom';
import { FaBell, FaCog, FaUser } from 'react-icons/fa';
import cimicoLogo from '/logo-cimico.png';

export default function NavBar() {
    const navigationsList = ["Summary", "Analytics", "Recommender", "Training"];
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
                            <Link to={`/${nav.toLowerCase()}`} className={`text-base font-lato ${nav === "Summary" ? "text-white" : (location.pathname === `/${nav.toLowerCase()}` ? "text-[#00A1FF]" : "text-[#6C83A2]")}`}>
                                {nav}
                            </Link>
                            {/* Line under Summary */}
                            {nav === "Summary" && <div className="absolute left-[1rem] bottom-[-11px] right-0 h-[4px] w-[2rem] bg-cimicoLine"></div>}
                            {/* Underline for active link */}
                            <span className={`absolute bottom-[-4px] left-0 right-0 h-[2px] transition-all duration-300 ${location.pathname === `/${nav.toLowerCase()}` ? 'block bg-[#00CFFF]' : 'hidden'}`}></span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right side with icons and user info - Positioned at the end */}
            <div className="flex items-center gap-6">
                <div className="relative">
                    <FaBell className="text-white text-xl" />
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full px-1 text-xs font-bold">4</span>
                </div>
                <FaCog className="text-white text-xl" />
                <div className="flex items-center gap-2">
                    <FaUser className="text-white text-xl" />
                    <span className="text-white font-lato">John Doe</span>
                </div>
            </div>
        </nav>
    );
}
