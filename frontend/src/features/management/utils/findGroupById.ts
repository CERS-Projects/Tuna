import { type TreeType } from "../types/group";

export const findGroupById = (
  groups: TreeType[],
  targetId: number,
): TreeType | undefined => {
  for (const group of groups) {
    if (group.groupId === targetId) return group;
    const targetGroup: TreeType | undefined = group.branchGroups
      ? findGroupById(group.branchGroups, targetId)
      : undefined;
    if (targetGroup) return targetGroup;
  }

  return undefined;
};
