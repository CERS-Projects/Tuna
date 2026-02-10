import { Navigate, Outlet } from "react-router";
import { useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { useCreateProfile } from "../hooks/useCreateProfile";
import { paths } from "@/config/paths";
import { ApiRequestError } from "@/types/apiRequestError";
import { Spinner } from "@/components/ui/spinner/spinner";

const ProtectedRoute = () => {
  const { authToken } = useAuth();

  const { data: user, error, isLoading: isUserLoading } = useUser(authToken);

  const { mutate: createProfileMutate, isPending: isCreating } =
    useCreateProfile(authToken);

  const hasShownError = useRef(false);
  const hasTriggeredCreation = useRef(false);

  useEffect(() => {
    if (!error) return;

    if (
      error instanceof ApiRequestError &&
      error.statusMessage === "NOT_FOUND"
    ) {
      if (!hasTriggeredCreation.current) {
        hasTriggeredCreation.current = true;
        createProfileMutate();
      }
      return;
    }

    if (!hasShownError.current) {
      alert("ユーザ情報の取得に失敗しました。");
      hasShownError.current = true;
    }
  }, [error, createProfileMutate]);

  if (!authToken) {
    return <Navigate to={paths.auth.login.path} replace />;
  }

  if (isUserLoading || isCreating) {
    return <Spinner isDark={true} />;
  }

  if (user) {
    return <Outlet />;
  }

  if (error) {
    return <Navigate to={paths.welcome.path} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
