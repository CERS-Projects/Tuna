import { type ReactNode, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "./authContext.ts";
import { type LoginInfo, type LoginResponse } from "../types/auth.ts";
import { useLogin } from "../hooks/useLogin.ts";
import { useLogout } from "../hooks/useLogout.ts";
import { useRefreshToken } from "../hooks/useRefreshToken.ts";
import { useNavigate } from "react-router";
import { paths } from "@/config/paths.ts";
import { ApiRequestError } from "@/types/apiRequestError.ts";
import { Spinner } from "@/components/ui/spinner/spinner.tsx";

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: loginMutate, isPending: isLoggingIn } = useLogin();
  const { mutate: logoutMutate, isPending: isLoggingOut } = useLogout();
  const { mutate: refreshMutate } = useRefreshToken();

  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  const [authToken, setAuthToken] = useState<string>("");
  useEffect(() => {
    refreshMutate(undefined, {
      onSuccess: (data: LoginResponse) => {
        setAuthToken(data.token);
      },
      onError: () => {
        navigate(paths.auth.login.path);
      },
      onSettled: () => {
        setIsAuthChecking(false);
      },
    });
  }, [navigate, setAuthToken, setIsAuthChecking, refreshMutate]);

  const login = (info: LoginInfo) => {
    loginMutate(info, {
      onSuccess: (data: LoginResponse) => {
        setAuthToken(data.token);
        navigate(paths.app.timeline.path);
      },
      onError: (error) => {
        if (error instanceof ApiRequestError) {
          alert(`ログイン失敗: ${error.message}`);
        } else {
          alert("予期せぬエラーが発生しました");
        }
      },
    });
  };

  const logout = () => {
    logoutMutate(authToken, {
      onSettled: () => {
        queryClient.clear();
        setAuthToken("");
        navigate(paths.auth.login.path);
      },
    });
  };

  const contextValue = {
    authToken,
    setAuthToken,
    login,
    isLoggingIn,
    logout,
    isLoggingOut,
  };

  if (isAuthChecking) {
    return <Spinner isDark={true} />;
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
