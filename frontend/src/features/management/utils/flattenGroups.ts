import { type TreeType } from "../types/group";

export const flattenGroups = (
  groups: TreeType[],
  selectedGroupId: number | null
): TreeType[] => {
  const flatten: TreeType[] = [];

  for (const group of groups) {
    if (group.id !== selectedGroupId) flatten.push(group);

    if (group.branch) {
      const childGroups = flattenGroups(group.branch, selectedGroupId);
      flatten.push(...childGroups);
    }
  }

  return flatten;
};
