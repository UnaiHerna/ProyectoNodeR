interface NavControlsProps {
    activeTab?: string;
    setActiveTab?: (tab: string) => void;
    }

const NavegationPanel: React.FC<NavControlsProps> = ({ activeTab, setActiveTab }) => {
    return(
        <>
            <section className="w-full h-full flex flex-col items-center bg-slate-800">
                    <div><img src="/burbujas.png" alt="" /></div>
                    <div><img src="/metro.png" alt="" /></div>
                    <div><img src="/probeta.png" alt="" /></div>
                    <div><img src="/embudo.png" alt="" /></div>
            </section>
        </>
    )
}

export default NavegationPanel;