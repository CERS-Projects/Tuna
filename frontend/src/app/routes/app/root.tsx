import { Outlet } from "react-router";
import { AppLayout } from "@/components/layouts/appLayout/appLayout";

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

// Outletを後にレイアウトで囲む
const AppRoot = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default AppRoot;
