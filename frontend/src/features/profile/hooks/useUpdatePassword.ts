import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { type EditPasswordForm } from "../types/setting";

export const useUpdatePassword = () => {
  const { authToken, logout } = useAuth();

  const apiWithRefresh = useApiWithRefresh();

  return useMutation({
    mutationFn: async (data: EditPasswordForm) => {
      return await apiWithRefresh<void>({
        url: `/change/password`,
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(data),
        },
      });
    },
    onSuccess: () => {
      window.alert(
        "パスワードが更新されました。\n再度ログインをお願いします。",
      );
      logout();
    },
    onError: () => {
      window.alert("パスワード更新に失敗しました");
    },
  });
};
