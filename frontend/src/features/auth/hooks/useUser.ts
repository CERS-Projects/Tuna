import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { type ProfileData } from "@/features/profile/types/profileTypes";
import { type User } from "@/types/user";
import { decodeUserParams } from "../utils/jwt";
import { type JWTPayload } from "../types/auth";
import { ApiRequestError } from "@/types/apiRequestError";

export const useUser = (
  authToken: string,
  options?: Partial<UseQueryOptions<User>>,
) => {
  const apiWithRefresh = useApiWithRefresh();
  const jwtPayload = decodeUserParams(authToken) as JWTPayload;

  return useQuery({
    queryKey: ["user", jwtPayload?.sub],
    queryFn: async (): Promise<User> => {
      try {
        const profile = await apiWithRefresh<ProfileData>({
          url: "/profile/me",
          options: {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          },
        });

        return {
          showUserId: profile.showUserId,
          userName: profile.nickname,
          iconUrl: profile.iconUrl,
          follow: profile.followCount,
          follower: profile.followerCount,
          introduction: profile.introduction,
          role: jwtPayload?.role ?? "STUDENT",
        };
      } catch (error) {
        if (
          error instanceof ApiRequestError &&
          error.statusMessage === "NOT_FOUND"
        ) {
          await apiWithRefresh({
            url: "/profile",
            options: {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            },
          });

          const profile = await apiWithRefresh<ProfileData>({
            url: "/profile/me",
            options: {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            },
          });
          alert("プロフィールが作成されていなかったため、作成しました");

          return {
            showUserId: profile.showUserId,
            userName: profile.nickname,
            iconUrl: profile.iconUrl,
            follow: profile.followCount,
            follower: profile.followerCount,
            introduction: profile.introduction,
            role: jwtPayload?.role ?? "STUDENT",
          };
        }

        throw error;
      }
    },
    enabled: !!authToken,
    staleTime: 1000 * 60 * 10,
    retry: false,
    throwOnError: false,
    ...options,
  });
};
