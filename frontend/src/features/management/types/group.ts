export type TreeType = {
  id: number;
  name: string;
  member?: number;
  branch?: TreeType[];
};

export type CreateGroupsType = {
  parentGroupId: number;
  newGroupName: string;
  members: { userId: number; isJoined: boolean }[];
};

export type CreateGroupsRequestType = {
  parentGroupId: number;
  newGroupName: string;
  members: number[];
};

export type GradeOption = {
  value: number;
  label: string;
};
