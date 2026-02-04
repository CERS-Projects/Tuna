import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { type ProfileData } from "@/features/profile/types/profileTypes";
import { type User } from "@/types/user";
import { decodeUserParams } from "../utils/jwt";
import { type JWTPayload } from "../types/auth";

export const useUser = (
  authToken: string,
  options?: Partial<UseQueryOptions<User>>,
) => {
  const user = decodeUserParams(authToken) as JWTPayload;
  const apiWithRefresh = useApiWithRefresh();
  return useQuery({
    queryKey: ["user", user.sub],
    queryFn: async () => {
      const profile = await apiWithRefresh<ProfileData>({
        url: "/profile",
        options: {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      });

      const userInfo = decodeUserParams(authToken);
      const user: User = { ...profile, role: userInfo?.role ?? "STUDENT" };

      return user;
    },
    enabled: !!authToken,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
};
