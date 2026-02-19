import { useMutation } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { ReportCreateRequest } from "../types/reportCreate";

export const useCreateReport = () => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();

  return useMutation({
    mutationFn: async (data: ReportCreateRequest): Promise<void> => {
      await apiWithRefresh<void>({
        url: "/report/create",
        options: {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      });
    },
  });
};
