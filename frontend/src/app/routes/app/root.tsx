import { Outlet } from "react-router";

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

// Outletを後にレイアウトで囲む
const AppRoot = () => {
  return <Outlet />;
};

export default AppRoot;
