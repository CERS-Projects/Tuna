export type ReportType = {
  reportId: string;
  reportedName: string;
  reportedShowUserId: string;
  reportByName: string;
  reportByShowUserId: string;
  reasonId: number;
  reportDate: string;
  reportedPostDate: string;
  reportedPost: string;
  reportDetail: string;
};

export type ReasonLabel = {
  label: string;
  color: string;
  textColor: string;
};

export const reasonLabels: Record<number, ReasonLabel> = {
  1: { label: "不適切なコンテンツ", color: "#fee2e2", textColor: "#dc2626" },
  2: { label: "スパム", color: "#fef9c3", textColor: "#ca8a04" },
  3: { label: "性的コンテンツ", color: "#f3e8ff", textColor: "#9333ea" },
  4: { label: "いやがらせ/いじめ", color: "#dbeafe", textColor: "#2563eb" },
  5: { label: "その他", color: "#e0e0e0", textColor: "#000000" },
};
