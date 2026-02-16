import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUser } from "@/features/auth/hooks/useUser";
import { type FilterWords } from "../types/setting";

export const useUpdateFilterWords = () => {
  const queryClient = useQueryClient();
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const { data: user } = useUser(authToken);

  return useMutation({
    mutationFn: async (data: FilterWords) => {
      return await apiWithRefresh<void>({
        url: "/profile/filter-words",
        options: {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      });
    },
    onSuccess: (_, variables) => {
      if (user) {
        queryClient.setQueryData(["filterWords", user.userId], variables);
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        queryClient.invalidateQueries({
          queryKey: ["user", "profile", user.showUserId],
        });
      }
    },
  });
};
