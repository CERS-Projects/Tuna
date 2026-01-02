import { type TreeType } from "../types/group";

export const flattenGroups = (groups: TreeType[]): TreeType[] => {
  const flatten: TreeType[] = [];

  for (const group of groups) {
    flatten.push(group);

    if (group.branch) {
      const childGroups = flattenGroups(group.branch);
      flatten.push(...childGroups);
    }
  }

  return flatten;
};
