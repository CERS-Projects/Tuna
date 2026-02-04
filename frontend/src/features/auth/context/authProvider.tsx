import { type ReactNode, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "./authContext.ts";
import {
  type OtpTokenResponse,
  type LoginInfo,
  type LoginResponse,
  type OtpInfo,
} from "../types/auth.ts";
import { useLogin } from "../hooks/useLogin.ts";
import { useLogout } from "../hooks/useLogout.ts";
import { useRefreshToken } from "../hooks/useRefreshToken.ts";
import { useNavigate, useLocation } from "react-router";
import { paths } from "@/config/paths.ts";
import { ApiRequestError } from "@/types/apiRequestError.ts";
import { Spinner } from "@/components/ui/spinner/spinner.tsx";
import { useOtp } from "../hooks/useOtp.ts";

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const { mutate: loginMutate, isPending: isLoggingIn } = useLogin();
  const { mutate: otpMutate, isPending: isOtpLoggingIn } = useOtp();
  const { mutate: logoutMutate, isPending: isLoggingOut } = useLogout();
  const { mutate: refreshMutate } = useRefreshToken();

  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [otpTempToken, setOtpTempToken] = useState<string>("");
  const [authToken, setAuthToken] = useState<string>("");
  const [otpFailedCount, setOtpFailedCount] = useState<number>(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("otpTempToken");
    if (stored) {
      try {
        const { token, expiresAt } = JSON.parse(stored);
        const now = Date.now();

        if (now < expiresAt) {
          setOtpTempToken(token);
        } else {
          sessionStorage.removeItem("otpTempToken");
          sessionStorage.removeItem("otpFailedCount");
        }
      } catch {
        sessionStorage.removeItem("otpTempToken");
        sessionStorage.removeItem("otpFailedCount");
      }
    }

    const storedCount = sessionStorage.getItem("otpFailedCount");
    if (storedCount) {
      setOtpFailedCount(Number(storedCount));
    }
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;

    const isLoginPath = currentPath === paths.auth.login.path;
    const isTwoFactorAuthPath = currentPath === paths.auth.twoFactorAuth.path;

    if (isTwoFactorAuthPath) {
      const stored = sessionStorage.getItem("otpTempToken");
      if (!stored) {
        navigate(paths.auth.login.path, { replace: true });
        setIsAuthChecking(false);
        return;
      }
      try {
        const { expiresAt } = JSON.parse(stored);
        if (Date.now() >= expiresAt) {
          sessionStorage.removeItem("otpTempToken");
          sessionStorage.removeItem("otpFailedCount");
          navigate(paths.auth.login.path, { replace: true });
          setIsAuthChecking(false);
          return;
        }
      } catch {
        sessionStorage.removeItem("otpTempToken");
        sessionStorage.removeItem("otpFailedCount");
        navigate(paths.auth.login.path, { replace: true });
        setIsAuthChecking(false);
        return;
      }
    }

    refreshMutate(undefined, {
      onSuccess: (data: OtpTokenResponse) => {
        setAuthToken(data.token);

        if (isLoginPath) {
          navigate(paths.app.timeline.path, { replace: true });
        }
      },
      onError: () => {
        if (!isLoginPath && !isTwoFactorAuthPath) {
          navigate(paths.auth.login.path, { replace: true });
        }
      },
      onSettled: () => {
        setIsAuthChecking(false);
      },
    });
  }, [navigate, setIsAuthChecking, refreshMutate]);

  const login = (info: LoginInfo) => {
    loginMutate(info, {
      onSuccess: (data: LoginResponse) => {
        const expiresAt = Date.now() + 5 * 60 * 1000;
        sessionStorage.setItem(
          "otpTempToken",
          JSON.stringify({ token: data.otpToken, expiresAt }),
        );
        sessionStorage.setItem("otpFailedCount", "0");

        setOtpTempToken(data.otpToken);
        setOtpFailedCount(0);
        navigate(paths.auth.twoFactorAuth.path);
      },
      onError: (error) => {
        if (error instanceof ApiRequestError) {
          if (error.body?.statusCode === 403) {
            alert(`ログイン失敗: ${error.body.errorMessage}`);
          } else {
            alert(`ログイン失敗`);
          }
        } else {
          console.error(error);
          alert("予期せぬエラーが発生しました");
        }
      },
    });
  };

  const otpLogin = (info: OtpInfo) => {
    otpMutate(info, {
      onSuccess: (data: OtpTokenResponse) => {
        sessionStorage.removeItem("otpTempToken");
        sessionStorage.removeItem("otpFailedCount");

        setAuthToken(data.token);
        setOtpFailedCount(0);
        navigate(paths.app.timeline.path, { replace: true });
      },
      onError: (error) => {
        const newFailedCount = otpFailedCount + 1;
        setOtpFailedCount(newFailedCount);
        sessionStorage.setItem("otpFailedCount", String(newFailedCount));

        if (newFailedCount >= 3) {
          alert("認証に3回失敗したため、ログイン画面に戻ります");
          sessionStorage.removeItem("otpTempToken");
          sessionStorage.removeItem("otpFailedCount");
          setOtpTempToken("");
          setOtpFailedCount(0);
          navigate(paths.auth.login.path, { replace: true });
          return;
        }

        if (error instanceof ApiRequestError) {
          if (error.body?.statusCode === 401) {
            alert(
              `ログイン失敗: ${error.body.errorMessage} (残り${3 - newFailedCount}回)`,
            );
          } else {
            alert(`ログイン失敗 (残り${3 - newFailedCount}回)`);
          }
        } else {
          console.error(error);
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
        navigate(paths.auth.login.path, { replace: true });
      },
    });
  };

  const contextValue = {
    authToken,
    setAuthToken,
    login,
    isLoggingIn,
    otpTempToken,
    otpLogin,
    isOtpLoggingIn,
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
