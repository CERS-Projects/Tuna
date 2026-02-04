import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { paths } from "@/config/paths";

const ProtectedRoute = () => {
  const { authToken } = useAuth();
  const { isError } = useUser(authToken);

  if (!authToken) return <Navigate to={paths.auth.login.path} replace />;
  if (isError) {
    alert("ユーザ情報の取得に失敗しました。");
    return <Navigate to={paths.welcome.path} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
