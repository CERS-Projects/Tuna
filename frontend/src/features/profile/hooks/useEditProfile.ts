import { useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUser } from "@/features/auth/hooks/useUser";
import { useParams, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";

export const useEditProfile = () => {
  const { authToken } = useAuth();
  const { data: user, isLoading: isUserLoading } = useUser(authToken);
  const { showUserId } = useParams();
  const navigate = useNavigate();

  const apiWithRefresh = useApiWithRefresh();
  const queryClient = useQueryClient();

  const isMyProfile = !!user && user.showUserId === showUserId;

  const editProfile = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!user) return;

      return await apiWithRefresh<void>({
        url: `/profile`,
        options: {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        },
      });
    },
    onSuccess: () => {
      if (user)
        queryClient.invalidateQueries({
          queryKey: ["user", user?.userId.toString()],
        });

      queryClient.invalidateQueries({
        queryKey: ["user", "profile", showUserId],
      });
      queryClient.invalidateQueries({
        queryKey: ["post"],
      });
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  useEffect(() => {
    const isProcessingOrDone = editProfile.isPending || editProfile.isSuccess;

    if (!isUserLoading && user && !isMyProfile && !isProcessingOrDone) {
      navigate(-1);
    }
  }, [
    isUserLoading,
    user,
    isMyProfile,
    navigate,
    editProfile.isPending,
    editProfile.isSuccess,
  ]);

  return {
    user,
    isMyProfile,
    isLoading: isUserLoading,
    ...editProfile,
  };
};
