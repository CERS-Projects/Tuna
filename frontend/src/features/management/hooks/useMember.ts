import { useQuery } from "@tanstack/react-query";
import { type Member } from "../types/member";

export const DUMMY_MEMBERS: Member[] = [
  {
    userId: 101,
    showUserId: "2025_ST0001",
    name: "水戸 太郎",
    grade: 2,
  },
  {
    userId: 102,
    showUserId: "2025_ST0002",
    name: "佐藤 花子",
    grade: 1,
  },
  {
    userId: 103,
    showUserId: "2025_ST0003",
    name: "鈴木 一郎",
    grade: 3,
  },
  {
    userId: 104,
    showUserId: "2025_ST0004",
    name: "高橋 優子",
    grade: 2,
  },
  {
    userId: 105,
    showUserId: "2025_ST0005",
    name: "田中 健太",
    grade: 1,
  },
  {
    userId: 106,
    showUserId: "2025_ST0006",
    name: "伊藤 さくら",
    grade: 3,
  },
  {
    userId: 107,
    showUserId: "2025_ST0007",
    name: "渡辺 翔太",
    grade: 2,
  },
  {
    userId: 108,
    showUserId: "2025_ST0008",
    name: "山本 美咲",
    grade: 1,
  },
  {
    userId: 109,
    showUserId: "2025_ST0009",
    name: "中村 蓮",
    grade: 3,
  },
  {
    userId: 110,
    showUserId: "2025_ST0010",
    name: "小林 陽菜",
    grade: 2,
  },
];

export const useMembers = (groupId: number | null | undefined) => {
  return useQuery<Member[]>({
    queryKey: ["groupMembers", groupId],
    enabled: typeof groupId === "number" && Number.isFinite(groupId),
    queryFn: async () => {
      // API仕様に合わせて調整（例: /api/groups/:id/members）
      const res = await fetch(`/api/groups/${groupId}/members`);
      if (!res.ok) throw new Error("Failed to fetch group members");
      return (await res.json()) as Member[];
    },
    initialData: DUMMY_MEMBERS,
    staleTime: 60_000,
  });
};
