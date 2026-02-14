import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDebouncedCallback } from "use-debounce";
import { useUser } from "@/features/auth/hooks/useUser";
import { useEffect } from "react";

export const useFollow = (targetUserId: number) => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const { data: user } = useUser(authToken);
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
      queryClient.invalidateQueries({
        queryKey: ["user", "profile", user?.showUserId],
      });
    },
  });
};

export const useUnFollow = (targetUserId: number) => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const { data: user } = useUser(authToken);
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
      queryClient.invalidateQueries({
        queryKey: ["user", "profile", user?.showUserId],
      });
    },
  });
};

export const useDebouncedFollow = (targetUserId: number) => {
  const { mutate: followMutate } = useFollow(targetUserId);
  const { mutate: unFollowMutate } = useUnFollow(targetUserId);

  const debouncedToggle = useDebouncedCallback((isFollowing: boolean) => {
    if (isFollowing) {
      unFollowMutate(undefined);
    } else {
      followMutate(undefined);
    }
  }, 5000);

  useEffect(() => {
    return () => {
      debouncedToggle.flush();
    };
  }, [debouncedToggle]);

  return { debouncedToggle };
};
