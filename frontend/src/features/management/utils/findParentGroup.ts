import { type TreeType } from "@/features/management/types/group";

export function findParentGroup(
  groups: TreeType[],
  currentGroupId: number
): TreeType | null {
  for (const group of groups) {
    if (group.branch?.some((child) => child.id === currentGroupId)) {
      return group;
    }
    if (group.branch) {
      const found = findParentGroup(group.branch, currentGroupId);
      if (found) return found;
    }
  }
  return null;
}
