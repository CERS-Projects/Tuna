import { useQuery } from "@tanstack/react-query";
import { type AccountSearchType, type AccountType } from "../types/account";

const DUMMY_ACCOUNTS: AccountType[] = [
  {
    userId: 1,
    showUserId: "550e8400-e29b-41d4-a716-446655440000",
    name: "田中 太郎",
    authority: 1, // 管理者
    grade: 3,
    accountStopFlag: 0,
  },
  {
    userId: 2,
    showUserId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    name: "鈴木 花子",
    authority: 0, // モデレーター/リーダー
    grade: 2,
    accountStopFlag: 0,
  },
  {
    userId: 3,
    showUserId: "user_satou_123", // UUIDではなくスラッグ風の場合の例
    name: "佐藤 次郎",
    authority: -1, // 一般
    // gradeはオプショナルなので無しの場合
    accountStopFlag: 0,
  },
  {
    userId: 4,
    showUserId: "b2f4c1d9-8e2a-4c5d-9f3b-1a2e3c4d5e6f",
    name: "高橋 停止",
    authority: -1,
    grade: 1,
    accountStopFlag: 1, // アカウント停止中
  },
  {
    userId: 105,
    showUserId: "c3d5e7f9-0a2b-4c6d-8e0f-2a4c6e8g0i2k",
    name: "山田 開発用",
    authority: -1,
    grade: 4,
    accountStopFlag: 0,
  },
];

export const useAccounts = (searchInfo: AccountSearchType) => {
  const { data, isFetching, isError, refetch } = useQuery<AccountType[]>({
    queryKey: ["accounts", searchInfo],
    enabled: false,
    initialData: [],
    queryFn: async (): Promise<AccountType[]> => {
      // のちにAPIを実装
      return DUMMY_ACCOUNTS;
    },
    placeholderData: DUMMY_ACCOUNTS,
  });

  return { data, isFetching, isError, refetch };
};
