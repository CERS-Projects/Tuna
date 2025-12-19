export type TreeType = {
  id: string;
  name: string;
  member?: number;
  branch?: TreeType[];
};
