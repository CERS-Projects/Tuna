import { Outlet } from "react-router";
import { AuthProvider } from "./authProvider";

export const AuthWrapper = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};
