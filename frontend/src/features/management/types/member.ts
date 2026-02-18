export type Member = {
  userId: number;
  showUserId: string;
  userName: string;
  grade: number;
  isJoin: boolean;
};

export type ModifyGroupMemberType = {
  userId: number;
  modifiedIsJoined: boolean;
};

export type ModifyGroupRequestType = {
  parentGroupId: number;
  groupName: string;
  members: ModifyGroupMemberType[];
};
