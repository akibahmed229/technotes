// internal imports
import { Outlet } from "react-router-dom";

// external imports
import DashHeader from "./DashHeader";
import DashFooter from "./DashFooter";

const DashLayout = () => {
  return (
    <>
      <DashHeader />
      <div className="dash-container">
        <Outlet /> {/* this is the main content of the dashboard */}
      </div>
      <DashFooter />
    </>
  );
};

export default DashLayout;
