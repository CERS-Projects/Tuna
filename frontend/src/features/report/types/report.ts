export type ReportLocationState = {
  school_id: number;
  report_date: Date;
  report_by: number;
  reported_user: number;
  reason_id: string;
  reported_post_id: number;
  detail: string;

  post_content: string;
};
export type ReportOption = {
  id: string;
  label: string;
  value: string;
};
