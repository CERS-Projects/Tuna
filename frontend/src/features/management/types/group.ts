export type TreeType = {
  id: string;
  name: string;
  branch?: TreeType[];
};
