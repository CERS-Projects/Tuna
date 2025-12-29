import { type TreeType } from "../types/group";

export const countDescendantsGroups = (
  branch: TreeType[] | undefined
): number => {
  if (!branch) return 0;

  let count = branch.length;

  for (const item of branch) {
    if (item.branch) {
      count = count + countDescendantsGroups(item.branch);
    }
  }

  return count;
};
