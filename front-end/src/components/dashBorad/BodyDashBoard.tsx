import React from "react";
import SidebarAndNavbar from "../../pages/Home/Home_components/Navbar";
// import { useParams } from "react-router-dom";
import TrainCrad from "./cards/TrainCard";

const BodyDashBoard: React.FC = () => {
    // const { title } = useParams<{ title: string}>();
  return (
    <>
        <SidebarAndNavbar  title="Home"/>
        <div className="pt-24 flex flex-row flex-wrap gap-3 ml-2">
          <TrainCrad />
        </div>
    </>
  );
};

export default BodyDashBoard;
