import { Navigate, Outlet } from "react-router";
import { paths } from "@/config/paths";
import { useAuth } from "../hooks/useAuth";
import { decodeUserParams } from "../utils/jwt";

const TeacherProtectedRoute = () => {
  const { authToken } = useAuth();

  if (!authToken) return <Navigate to={paths.auth.login.path} replace />;

  const userInfo = decodeUserParams(authToken);
  const role = userInfo?.role ?? "STUDENT";

  if (role === "STUDENT") {
    return <Navigate to={paths.app.timeline.path} replace />;
  }

  return <Outlet />;
};

export default TeacherProtectedRoute;
