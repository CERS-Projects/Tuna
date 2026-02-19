import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { paths } from "@/config/paths";
import { api } from "@/lib/api-client";
import { type passwordResetForm } from "../types/form";

export const useSendPasswordResetEmail = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: passwordResetForm) => {
      return await api<void>({
        url: "/reset/password/mail",
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      });
    },
    onSuccess: (_, variables) => {
      window.alert("メールを送信しました");
      navigate(paths.auth.passReset.confirm.path, {
        state: { isSend: true, email: variables.mailAddress },
      });
    },
    onError: () => {
      window.alert("メール送信に失敗しました");
    },
  });
};
