import { Outlet } from "react-router";
import { Header } from "@/components/ui/header/header";

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

// Outletを後にレイアウトで囲む
const ManagementRoot = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default ManagementRoot;
