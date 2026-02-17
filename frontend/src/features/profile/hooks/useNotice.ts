import { useQuery } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { type NoticeType } from "../types/notice";
import { useUser } from "@/features/auth/hooks/useUser";

export const useNotice = () => {
  const { authToken } = useAuth();
  const apiWithRefresh = useApiWithRefresh();
  const { data: user } = useUser(authToken);

  return useQuery({
    queryKey: ["notice"],
    enabled: !!authToken && !!user,
    queryFn: async (): Promise<NoticeType[]> => {
      let apiUrl: string;
      if (user?.role === "STUDENT") {
        apiUrl = `/notice/list`;
      } else {
        apiUrl = `/notice/teacher/list`;
      }

      const notice = await apiWithRefresh<NoticeType[]>({
        url: apiUrl,
        options: {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });

      return notice;
    },
    throwOnError: false,
    retry: false,
    refetchOnMount: true,
  });
};
