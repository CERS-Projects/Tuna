export type AccountSearchType = {
  query: string;
  authority: -2 | -1 | 0 | 1;
};

export type AccountType = {
  userId: number;
  showUserId: string;
  name: string;
  authority: -1 | 0 | 1;
  grade?: number;
  accountStopFlag: 0 | 1;
};

export type AccountEditType = {
  userId: number;
  showUserId: string;
  email: string;
  name: string;
  accountStopFlag: 0 | 1;
};

export type StudentAccountEditType = AccountEditType & {
  grade: number;
  graduateDate: string;
};

export type TeacherAccountEditType = AccountEditType & {
  authority: 0 | 1;
};
