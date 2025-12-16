import { Outlet } from "react-router";
import { ManagementLayout } from "@/components/layouts/managementLayout/managementLayout";

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const ManagementRoot = () => {
  return (
    <ManagementLayout>
      <Outlet />
    </ManagementLayout>
  );
};

export default ManagementRoot;
