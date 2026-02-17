export type TreeType = {
  groupId: number;
  groupName: string;
  upperGroupId?: number | null;
  member?: number;
  branchGroups?: TreeType[];
};

export type GroupFormType = {
  parentGroupId: number;
  groupName: string;
  members: { userId: number; isJoined: boolean }[];
};

export type GroupCreateType = {
  parentGroupId: number;
  groupName: string;
  membersUserId: number[];
};

export type GroupDeleteRequestType = {
  parentId: number;
  groupId: number;
};

export type GradeOption = {
  value: number;
  label: string;
};
