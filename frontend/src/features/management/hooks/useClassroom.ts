import { useQuery } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { ClassroomDetailResponse } from "../types/classroom";

export const useClassroom = (roomId: string) => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();

  const { data, isFetching, isError, refetch } =
    useQuery<ClassroomDetailResponse>({
      queryKey: ["classroom", "edit", roomId],
      enabled: !!authToken && !!roomId,
      queryFn: async (): Promise<ClassroomDetailResponse> => {
        return await apiWithRefresh<ClassroomDetailResponse>({
          url: `/classroom/detail?roomId=${roomId}`,
          options: {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          },
        });
      },
      refetchOnMount: true,
    });

  return {
    data,
    isFetching,
    isError,
    refetch,
  };
};
