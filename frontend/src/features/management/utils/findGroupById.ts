import { type TreeType } from "../types/group";

export const findGroupById = (
  groups: TreeType[],
  targetId: number
): TreeType | undefined => {
  for (const group of groups) {
    if (group.id === targetId) return group;
    const targetGroup: TreeType | undefined = group.branch
      ? findGroupById(group.branch, targetId)
      : undefined;
    if (targetGroup) return targetGroup;
  }

  return undefined;
};
