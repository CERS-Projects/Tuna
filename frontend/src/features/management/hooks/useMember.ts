import { useQuery } from "@tanstack/react-query";
import { type Member } from "../types/member";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { decodeUserParams } from "@/features/auth/utils/jwt";
import { useApiWithRefresh } from "@/lib/api-client";

export const useMembers = (groupId: number | null) => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const userInfo = decodeUserParams(authToken);

  return useQuery<Member[]>({
    queryKey: ["members", userInfo?.schoolId, groupId],
    enabled: !!authToken && !!userInfo,
    queryFn: async (): Promise<Member[]> => {
      if (groupId === null) return [];

      const res = await apiWithRefresh<Member[]>({
        url: `/groups/users?groupId=${groupId}`,
        options: {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });

      return res;
    },
    refetchOnMount: true,
    throwOnError: false,
  });
};
