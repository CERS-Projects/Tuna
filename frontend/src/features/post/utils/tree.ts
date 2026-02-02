import { type TreeType } from "@/features/management/types/group";

export const getAllIds = (node: TreeType): number[] => {
  const ids = [node.id];
  if (node.branch) {
    node.branch.forEach((child) => {
      ids.push(...getAllIds(child));
    });
  }
  return ids;
};

export const flattenTree = (nodes: TreeType[]): TreeType[] => {
  const result: TreeType[] = [];
  const traverse = (node: TreeType) => {
    result.push(node);
    if (node.branch) {
      node.branch.forEach(traverse);
    }
  };
  nodes.forEach(traverse);
  return result;
};
