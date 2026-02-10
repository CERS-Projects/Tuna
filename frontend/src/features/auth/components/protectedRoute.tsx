import { Navigate, Outlet } from "react-router";
import { useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { paths } from "@/config/paths";

const ProtectedRoute = () => {
  const { authToken } = useAuth();
  const { isError } = useUser(authToken);
  const hasShownError = useRef(false);

  useEffect(() => {
    if (isError && !hasShownError.current) {
      alert("ユーザ情報の取得に失敗しました。");
      hasShownError.current = true;
    }
  }, [isError]);

  if (!authToken) return <Navigate to={paths.auth.login.path} replace />;
  if (isError) {
    return <Navigate to={paths.welcome.path} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
