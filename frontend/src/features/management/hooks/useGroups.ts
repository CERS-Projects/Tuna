import { useQuery } from "@tanstack/react-query";
import { type TreeType } from "../types/group";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useApiWithRefresh } from "@/lib/api-client";
import { decodeUserParams } from "@/features/auth/utils/jwt";

export const useGroups = () => {
  const { authToken } = useAuth();
  const apiWithRefresh = useApiWithRefresh();

  const userInfo = decodeUserParams(authToken);

  const {
    data: groups,
    isFetching,
    isError,
  } = useQuery<TreeType[]>({
    enabled: !!userInfo,
    queryKey: ["groups", userInfo?.schoolId, userInfo?.sub],
    queryFn: async (): Promise<TreeType[]> => {
      if (!userInfo) return [];

      const groups = await apiWithRefresh<TreeType[]>({
        url: userInfo.role === "STUDENT" ? `/groups/me` : `/groups`,
        options: {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      });
      return groups;
    },
    placeholderData: [],
    refetchOnMount: true,
  });

  return { groups: groups ?? [], isFetching, isError };
};
