import { Navigate, Outlet } from "react-router";
import { paths } from "@/config/paths";
import { useAuth } from "../hooks/useAuth";
import { decodeUserParams } from "../utils/jwt";

const AdminProtectedRoute = () => {
  const { authToken } = useAuth();

  if (!authToken) return <Navigate to={paths.auth.login.path} replace />;

  const userInfo = decodeUserParams(authToken);
  const role = userInfo?.role ?? "STUDENT";

  if (role !== "ADMIN_SCHOOL") {
    return <Navigate to={paths.app.management.account.list.path} replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
