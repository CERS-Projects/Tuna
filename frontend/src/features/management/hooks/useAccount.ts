import { useQuery } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  type StudentAccountEditType,
  type TeacherAccountEditType,
  type AccountDetailResponse,
} from "../types/account";

export const useAccount = (userId: number) => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();

  const { data, isFetching, isError } = useQuery<
    StudentAccountEditType | TeacherAccountEditType
  >({
    queryKey: ["account", userId],
    enabled: userId > 0,
    queryFn: async (): Promise<
      StudentAccountEditType | TeacherAccountEditType
    > => {
      const res = await apiWithRefresh<AccountDetailResponse>({
        url: `/accounts/detail?userId=${userId}`,
        options: {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });

      if (res.authority === null) {
        return {
          userId: res.userId,
          showUserId: res.showUserId,
          name: res.name,
          email: res.mailAddress,
          accountStopFlag: res.accountStopFlag ? 1 : 0,
          grade: res.grade ?? 1,
          graduateDate: res.graduateDate ?? "",
        } as StudentAccountEditType;
      } else {
        return {
          userId: res.userId,
          showUserId: res.showUserId,
          name: res.name,
          email: res.mailAddress,
          accountStopFlag: res.accountStopFlag ? 1 : 0,
          authority: res.authority ? 1 : 0,
        } as TeacherAccountEditType;
      }
    },
  });

  return { data, isFetching, isError };
};
