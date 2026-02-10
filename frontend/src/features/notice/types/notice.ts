export type Notice = {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
  groupIds?: number[];
  targetGroups?: number[];
};
