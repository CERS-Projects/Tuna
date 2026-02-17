import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  type AccountSearchType,
  type AccountType,
  type StudentAccountEditType,
  type TeacherAccountEditType,
} from "../types/account";

export const useAccounts = (searchInfo: AccountSearchType) => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();

  const {
    data: accounts,
    isFetching,
    isError,
    refetch,
  } = useQuery<AccountType[]>({
    queryKey: ["accounts", searchInfo],
    enabled: false,
    initialData: [],
    queryFn: async (): Promise<AccountType[]> => {
      return await apiWithRefresh<AccountType[]>({
        url: "/accounts/all",
        options: {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });
    },
  });

  const data = useMemo(() => {
    if (!accounts) return [];
    return accounts.filter((account) => {
      if (searchInfo.query) {
        const q = searchInfo.query.toLowerCase();
        const matchName = account.name.toLowerCase().includes(q);
        const matchId = account.showUserId.toLowerCase().includes(q);
        if (!matchName && !matchId) return false;
      }

      if (searchInfo.authority !== -2) {
        if (searchInfo.authority === -1) {
          if (account.authority !== null) return false;
        } else if (searchInfo.authority === 0) {
          if (account.authority !== false) return false;
        } else if (searchInfo.authority === 1) {
          if (account.authority !== true) return false;
        }
      }
      return true;
    });
  }, [accounts, searchInfo]);

  return { data, isFetching, isError, refetch };
};

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
      const allAccounts = await apiWithRefresh<AccountType[]>({
        url: "/accounts/all",
        options: {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });

      const account = allAccounts.find((a) => a.userId === userId);
      if (!account) {
        throw new Error("アカウントが見つかりません");
      }

      if (account.authority === null) {
        return {
          userId: account.userId,
          showUserId: account.showUserId,
          name: account.name,
          email: "",
          accountStopFlag: account.isAccountStopFlag ? 1 : 0,
          grade: account.grade ?? 1,
          graduateDate: "",
        } as StudentAccountEditType;
      } else {
        return {
          userId: account.userId,
          showUserId: account.showUserId,
          name: account.name,
          email: "",
          accountStopFlag: account.isAccountStopFlag ? 1 : 0,
          authority: account.authority ? 1 : 0,
        } as TeacherAccountEditType;
      }
    },
  });

  return { data, isFetching, isError };
};
