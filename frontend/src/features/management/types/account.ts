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

export type StudentAccountRegisterType = {
  name: string;
  grade: number;
  email: string;
  password: string;
  passwordConfirm: string;
  entryDate: string;
  graduateDate: string;
};

export type TeacherAccountRegisterType = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export type StudentAccountImportType = {
  showUserId: string;
  name: string;
  grade: number;
  email: string;
  password: string;
  entryDate: string;
  graduateDate: string;
};
