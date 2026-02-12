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

  const {
    data: user,
    error: getUserError,
    isLoading: isUserLoading,
  } = useUser(authToken);

  const {
    mutate: createProfileMutate,
    isPending: isCreating,
    error: createProfileError,
  } = useCreateProfile(authToken);

  const hasShownError = useRef(false);
  const hasTriggeredCreation = useRef(false);

  useEffect(() => {
    if (!getUserError) return;

    if (
      getUserError instanceof ApiRequestError &&
      getUserError.statusMessage === "NOT_FOUND"
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
  }, [getUserError, createProfileMutate]);

  if (!authToken) {
    return <Navigate to={paths.auth.login.path} replace />;
  }

  if (isUserLoading || isCreating) {
    return <Spinner isDark={true} />;
  }

  if (user) {
    return <Outlet />;
  }

  if (getUserError) {
    const isNotFound =
      getUserError instanceof ApiRequestError &&
      getUserError.statusMessage === "NOT_FOUND";

    if (isNotFound && !createProfileError) {
      return <Spinner isDark={true} />;
    }

    if (createProfileError) {
      return (
        <Navigate
          to={paths.auth.login.path}
          replace
          state={{
            errorMessage:
              "プロフィールの作成に失敗しました。再度ログインしてください。",
          }}
        />
      );
    }

    return (
      <Navigate
        to={paths.auth.login.path}
        replace
        state={{
          errorMessage:
            "ユーザー情報の取得に失敗しました。再度ログインしてください。",
        }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
