import { type TreeType } from "../types/group";

export const flattenGroups = (
  groups: TreeType[],
  selectedGroupId: number | null,
  options?: { excludeDescendants?: boolean },
): TreeType[] => {
  const flatten: TreeType[] = [];
  const excludeDescendants = options?.excludeDescendants ?? false;

  for (const group of groups) {
    const isSelected =
      selectedGroupId != null && group.groupId === selectedGroupId;

    if (!isSelected) flatten.push(group);

    if (isSelected && excludeDescendants) continue;

    if (group.branchGroups) {
      const childGroups = flattenGroups(
        group.branchGroups,
        selectedGroupId,
        options,
      );
      flatten.push(...childGroups);
    }
  }

  return flatten;
};
