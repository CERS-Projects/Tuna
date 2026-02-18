import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";

type CreateNoticeData = {
  title: string;
  content: string;
  groupId: number;
};

export const useCreateNotice = () => {
  const { authToken } = useAuth();
  const apiWithRefresh = useApiWithRefresh();
  const queryClient = useQueryClient();

  const createNoticeMutation = useMutation({
    mutationFn: async (data: CreateNoticeData) => {
      return await apiWithRefresh<void>({
        url: "/notice/create",
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
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });

  return {
    createNotice: createNoticeMutation.mutate,
    isCreating: createNoticeMutation.isPending,
  };
};
