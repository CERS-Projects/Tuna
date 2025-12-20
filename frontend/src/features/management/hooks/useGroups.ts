import { useQuery } from "@tanstack/react-query";
import { type TreeType } from "../types/group";

const dummyTree: TreeType[] = [
  {
    id: 1,
    name: "Category A",
    member: 21,
    branch: [
      {
        id: 2,
        name: "Subcategory A1",
        member: 22,
        branch: [
          { id: 21, name: "Item A1-1" },
          { id: 22, name: "Item A1-2" },
          {
            id: 23,
            name: "Item A1-3",
            branch: [
              {
                id: 231,
                name: "Subcategory A1",
                branch: [
                  { id: 2311, name: "Item A1-1" },
                  { id: 2312, name: "Item A1-2" },
                  { id: 2313, name: "Item A1-3" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 3,
        name: "Subcategory A2",
        member: 23,
        branch: [
          { id: 31, name: "Item A2-1" },
          { id: 32, name: "Item A2-2" },
          { id: 33, name: "Item A2-3" },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Category B",
    branch: [
      {
        id: 41,
        name: "Subcategory B1",
        branch: [
          { id: 411, name: "Item B1-1" },
          { id: 412, name: "Item B1-2" },
        ],
      },
    ],
  },
  {
    id: 5,
    name: "Category C",
    branch: [
      { id: 51, name: "Item C1" },
      { id: 52, name: "Item C2" },
    ],
  },
];

export const useGroups = () => {
  const {
    data: groups = dummyTree,
    isFetching,
    isError,
  } = useQuery<TreeType[]>({
    queryKey: ["groups"],
    // API ができたらここを本実装に差し替え
    queryFn: async () => {
      const res = await fetch("/api/groups");
      if (!res.ok) throw new Error("Failed to fetch groups");
      return (await res.json()) as TreeType[];
    },
    // テスト用デフォルトデータ
    initialData: dummyTree,
  });

  return { groups, isFetching, isError };
};
