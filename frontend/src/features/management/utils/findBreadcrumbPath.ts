import { type TreeType } from "../types/group";
import { type Breadcrumb } from "../types/breadcrumb";

export const findBreadcrumbPath = (
  nodes: TreeType[],
  targetId: number
): Breadcrumb[] | null => {
  for (const node of nodes) {
    if (node.id === targetId) {
      return [
        {
          id: node.id,
          crumb: node.name,
        },
      ];
    }

    if (node.branch) {
      const childPath = findBreadcrumbPath(node.branch, targetId);
      if (childPath) {
        return [{ id: node.id, crumb: node.name }, ...childPath];
      }
    }
  }

  return null;
};
