export type TreeType = {
  id: number;
  name: string;
  member?: number;
  branch?: TreeType[];
};

export type GroupFormType = {
  parentGroupId: number;
  groupName: string;
  members: { userId: number; isJoined: boolean }[];
};

export type GroupRequestType = {
  parentGroupId: number;
  groupName: string;
  members: number[];
};

export type GradeOption = {
  value: number;
  label: string;
};
