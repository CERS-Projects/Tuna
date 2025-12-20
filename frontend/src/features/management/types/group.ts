export type TreeType = {
  id: number;
  name: string;
  member?: number;
  branch?: TreeType[];
};
