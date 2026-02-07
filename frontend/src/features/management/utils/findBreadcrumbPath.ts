import { type TreeType } from "../types/group";
import { type Breadcrumb } from "../types/breadcrumb";

export const findBreadcrumbPath = (
  nodes: TreeType[],
  targetId: number,
): Breadcrumb[] | null => {
  for (const node of nodes) {
    if (node.groupId === targetId) {
      return [
        {
          id: node.groupId,
          crumb: node.groupName,
        },
      ];
    }

    if (node.branchGroups) {
      const childPath = findBreadcrumbPath(node.branchGroups, targetId);
      if (childPath) {
        return [{ id: node.groupId, crumb: node.groupName }, ...childPath];
      }
    }
  }

  return null;
};
