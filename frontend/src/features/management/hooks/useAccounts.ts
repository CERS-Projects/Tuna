import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { type AccountSearchType, type AccountType } from "../types/account";

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
