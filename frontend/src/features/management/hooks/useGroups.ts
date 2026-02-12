import { useQuery } from "@tanstack/react-query";
import { type TreeType } from "../types/group";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useApiWithRefresh } from "@/lib/api-client";
import { decodeUserParams } from "@/features/auth/utils/jwt";

const dummyTree: TreeType[] = [
  {
    groupId: 1,
    groupName: "Category A",
    member: 21,
    branchGroups: [
      {
        groupId: 2,
        groupName: "Subcategory A1",
        member: 22,
        branchGroups: [
          { groupId: 21, groupName: "Item A1-1" },
          { groupId: 22, groupName: "Item A1-2" },
          {
            groupId: 23,
            groupName: "Item A1-3",
            branchGroups: [
              {
                groupId: 231,
                groupName: "Subcategory A1",
                branchGroups: [
                  { groupId: 2311, groupName: "Item A1-1" },
                  { groupId: 2312, groupName: "Item A1-2" },
                  { groupId: 2313, groupName: "Item A1-3" },
                ],
              },
            ],
          },
        ],
      },
      {
        groupId: 3,
        groupName: "Subcategory A2",
        member: 23,
        branchGroups: [
          { groupId: 31, groupName: "Item A2-1" },
          { groupId: 32, groupName: "Item A2-2" },
          { groupId: 33, groupName: "Item A2-3" },
        ],
      },
    ],
  },
  {
    groupId: 4,
    groupName: "Category B",
    branchGroups: [
      {
        groupId: 41,
        groupName: "Subcategory B1",
        branchGroups: [
          { groupId: 411, groupName: "Item B1-1" },
          { groupId: 412, groupName: "Item B1-2" },
        ],
      },
    ],
  },
  {
    groupId: 5,
    groupName: "Category C",
    branchGroups: [
      { groupId: 51, groupName: "Item C1" },
      { groupId: 52, groupName: "Item C2" },
    ],
  },
];

export const useGroups = () => {
  const { authToken } = useAuth();
  const apiWithRefresh = useApiWithRefresh();

  const userInfo = decodeUserParams(authToken);

  const {
    data: groups,
    isFetching,
    isError,
  } = useQuery<TreeType[]>({
    enabled: !!userInfo,
    queryKey: ["groups", userInfo?.schoolId, userInfo?.sub],
    queryFn: async (): Promise<TreeType[]> => {
      if (!userInfo) return [];

      const groups = await apiWithRefresh<TreeType[]>({
        url: userInfo.role === "STUDENT" ? `/groups/me` : `/groups`,
        options: {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      });
      return groups;
    },
    placeholderData: dummyTree,
    refetchOnMount: true,
  });

  return { groups: groups ?? [], isFetching, isError };
};
