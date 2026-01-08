export type AccountSearchType = {
  query: string;
  authority: -1 | 0 | 1 | 2;
};

export type AccountType = {
  userId: number;
  showUserId: string;
  name: string;
  authority: 0 | 1 | 2;
  grade?: number;
  accountStopFlag: 0 | 1;
};
