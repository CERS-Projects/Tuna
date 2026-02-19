import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import { api } from "@/lib/api-client";
import {
  type ChangePasswordForm,
  type PasswordResetRequestType,
} from "../types/form";
import { paths } from "@/config/paths";

export const useConfirmToken = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  return useMutation({
    mutationFn: async () => {
      return await api<void>({
        url: `/reset/password?token=${token}`,
        options: {
          method: "GET",
        },
      });
    },
  });
};

export const usePasswordReset = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  return useMutation({
    mutationFn: async (data: ChangePasswordForm) => {
      const req: PasswordResetRequestType = {
        token: token ?? "",
        newPassword: data.newPassword,
      };
      return await api<void>({
        url: `/reset/password`,
        options: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req),
        },
      });
    },
    onSuccess: () => {
      window.alert("パスワードを再設定しました\n再度ログインをお願いします");
      navigate(paths.auth.login.path, { replace: true });
    },
    onError: () => {
      window.alert("パスワード再設定に失敗しました");
    },
  });
};
