import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
