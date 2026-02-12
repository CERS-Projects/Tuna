import { type TreeType } from "@/features/management/types/group";

export function findParentGroup(
  groups: TreeType[],
  currentGroupId: number,
): TreeType | null {
  for (const group of groups) {
    if (group.branchGroups?.some((child) => child.groupId === currentGroupId)) {
      return group;
    }
    if (group.branchGroups) {
      const found = findParentGroup(group.branchGroups, currentGroupId);
      if (found) return found;
    }
  }
  return null;
}
