export type ReportLocationState = {
  report_id: number;
  school_id: number;
  report_date?: Date;
  report_by: string;
  reported_user: string;
  reason: string;
  detail: string;
  post_content: string;
};
export type ReportOption = {
  id: string;
  label: string;
  value: string;
};
