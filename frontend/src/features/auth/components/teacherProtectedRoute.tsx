import { Navigate, Outlet } from "react-router";
import { paths } from "@/config/paths";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser"; // 変更: decodeUserParams ではなくこれを使う

const TeacherProtectedRoute = () => {
  const { authToken } = useAuth();

  const { data: user } = useUser(authToken);

  if (!user) return null;

  const role = user.role;

  if (role === "STUDENT") {
    return <Navigate to={paths.app.timeline.path} replace />;
  }

  return <Outlet />;
};

export default TeacherProtectedRoute;
