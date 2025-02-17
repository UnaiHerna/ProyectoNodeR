import { useState } from 'react';

interface NavControlsProps {
    activeTab?: string;
    setActiveTab?: (tab: string) => void;
}

const NavegationPanel: React.FC<NavControlsProps> = ({ activeTab: propActiveTab, setActiveTab: propSetActiveTab }) => {
    const [activeTab, setActiveTab] = useState<string>(propActiveTab || 'burbujas');
    const tabs = [
        { id: 'burbujas', src: '/burbujas.png', alt: 'Burbujas' },
        { id: 'metro', src: '/metro.png', alt: 'Metro' },
        { id: 'probeta', src: '/probeta.png', alt: 'Probeta' },
        { id: 'embudo', src: '/embudo.png', alt: 'Embudo' },
    ];

    const handleClick = (tabId: string) => {
        setActiveTab(tabId);
        propSetActiveTab?.(tabId); // Si se pasa un controlador de estado desde los props
        console.log(`Tab activa: ${tabs.find(tab => tab.id === tabId)?.alt}`);
        
    };

    return (
        <section className="w-full h-full flex flex-col items-center relative bg-[#f7f7f7] pt-7">
            {/* Barra azul de indicador en el lado derecho */}
            <span
                className={`absolute right-0 w-2 h-12 bg-[#002060] transition-transform duration-300 transform ${
                    activeTab === 'burbujas' ? 'translate-y-[10px]' :
                    activeTab === 'metro' ? 'translate-y-[72px]' :
                    activeTab === 'probeta' ? 'translate-y-[137px]' :
                    'translate-y-[200px]'
                }`}
            ></span>

            {/* Íconos */}
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    className="flex items-center justify-center w-full py-4 cursor-pointer"
                    onClick={() => handleClick(tab.id)}
                >
                    <img
                        src={tab.src}
                        alt={tab.alt}
                        className={`w-8 h-8 transition-opacity ${
                            activeTab === tab.id ? 'opacity-100' : 'opacity-100'
                        }`}
                    />
                </div>
            ))}
        </section>
    );
};

export default NavegationPanel;
