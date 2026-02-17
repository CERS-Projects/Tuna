export type AccountSearchType = {
  query: string;
  authority: -2 | -1 | 0 | 1;
};

export type AccountType = {
  userId: number;
  showUserId: string;
  name: string;
  grade: number | null;
  authority: boolean | null;
  isAccountStopFlag: boolean;
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
  showUserId: string;
  name: string;
  grade: number;
  email: string;
  password: string;
  passwordConfirm: string;
  entryDate: string;
  graduateDate: string;
};

export type TeacherAccountRegisterType = {
  showUserId: string;
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export type StudentAccountImportType = {
  showUserId: string;
  name: string;
  grade: number;
  mailaddress: string;
  password: string;
  admissionDate: string;
  graduateDate: string;
};

export type ModifyStudentAccountRequestType = {
  userId: number;
  name: string;
  mailAddress: string;
  graduateDate: string;
  accountStopFlag: boolean;
};

export type ModifyTeacherAccountRequestType = {
  userId: number;
  name: string;
  mailAddress: string;
  authorityFlag: boolean;
  accountStopFlag: boolean;
};
