import { Navigate, Outlet } from "react-router";
import { paths } from "@/config/paths";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";

const AdminProtectedRoute = () => {
  const { authToken } = useAuth();

  const { data: userInfo } = useUser(authToken);
  const role = userInfo?.role ?? "STUDENT";

  if (role !== "ADMIN_SCHOOL") {
    return <Navigate to={paths.app.management.account.list.path} replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
