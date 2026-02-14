import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDebouncedCallback } from "use-debounce";
import { useEffect } from "react";
import { type FollowData, type ProfileData } from "../types/profileTypes";
import { type User } from "@/types/user";

export const useFollow = (targetUserId: number, showUserId: string) => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await apiWithRefresh<void>({
        url: `/profile/follow?targetUserId=${targetUserId}`,
        options: {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });
    },
    onSuccess: () => {
      queryClient.setQueriesData(
        { queryKey: ["user", "profile", "following"] },
        (oldData: FollowData[]) => {
          if (!oldData) return oldData;

          if (Array.isArray(oldData)) {
            return oldData.map((followerUser) => {
              if (followerUser.userId === targetUserId) {
                return { ...followerUser, following: true };
              }
              return followerUser;
            });
          }

          return oldData;
        },
      );
      queryClient.setQueriesData(
        { queryKey: ["user", "profile", "follower"] },
        (oldData: FollowData[]) => {
          if (!oldData) return oldData;

          if (Array.isArray(oldData)) {
            return oldData.map((followerUser) => {
              if (followerUser.userId === targetUserId) {
                return { ...followerUser, following: true };
              }
              return followerUser;
            });
          }

          return oldData;
        },
      );
      queryClient.setQueriesData(
        { queryKey: ["user", "profile", showUserId], exact: true },
        (oldData: ProfileData | User) => {
          if (!oldData) return oldData;

          if ("isFollowing" in oldData)
            return {
              ...oldData,
              followerCount: oldData.followerCount + 1,
              isFollowing: true,
            };
          else
            return {
              ...oldData,
              followerCount: oldData.followerCount + 1,
            };
        },
      );
    },
  });
};

export const useUnFollow = (targetUserId: number, showUserId: string) => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await apiWithRefresh<void>({
        url: `/profile/unfollow?targetUserId=${targetUserId}`,
        options: {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });
    },
    onSuccess: () => {
      queryClient.setQueriesData(
        { queryKey: ["user", "profile", "following"] },
        (oldData: FollowData[]) => {
          if (!oldData) return oldData;

          if (Array.isArray(oldData)) {
            return oldData.map((followerUser) => {
              if (followerUser.userId === targetUserId) {
                return { ...followerUser, following: false };
              }
              return followerUser;
            });
          }

          return oldData;
        },
      );
      queryClient.setQueriesData(
        { queryKey: ["user", "profile", "follower"] },
        (oldData: FollowData[]) => {
          if (!oldData) return oldData;

          if (Array.isArray(oldData)) {
            return oldData.map((followerUser) => {
              if (followerUser.userId === targetUserId) {
                return { ...followerUser, following: false };
              }
              return followerUser;
            });
          }

          return oldData;
        },
      );
      queryClient.setQueriesData(
        { queryKey: ["user", "profile", showUserId], exact: true },
        (oldData: ProfileData | User) => {
          if (!oldData) return oldData;

          if ("isFollowing" in oldData)
            return {
              ...oldData,
              followerCount: oldData.followerCount - 1,
              isFollowing: false,
            };
          else
            return {
              ...oldData,
              followerCount: oldData.followerCount - 1,
            };
        },
      );
    },
  });
};

export const useDebouncedFollow = (
  targetUserId: number,
  showUserId: string,
) => {
  const { mutate: followMutate } = useFollow(targetUserId, showUserId);
  const { mutate: unFollowMutate } = useUnFollow(targetUserId, showUserId);

  const debouncedToggle = useDebouncedCallback((isFollowing: boolean) => {
    if (isFollowing) {
      unFollowMutate(undefined);
    } else {
      followMutate(undefined);
    }
  }, 1500);

  useEffect(() => {
    return () => {
      debouncedToggle.flush();
    };
  }, [debouncedToggle]);

  return { debouncedToggle };
};
