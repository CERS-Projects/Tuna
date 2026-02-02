import { flattenGroups } from "@/features/management/utils/flattenGroups";
import { type TreeType } from "@/features/management/types/group";

export const getAllIds = (node: TreeType): number[] => {
  return flattenGroups([node], null).map((group) => group.id);
};

export const flattenTree = (nodes: TreeType[]): TreeType[] => {
  return flattenGroups(nodes, null);
};
