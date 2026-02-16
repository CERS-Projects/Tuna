import { Fragment, useState } from "react";
import type { ReportType } from "../../types/report";
import { ReportSummaryRow } from "./reportSummaryRow";
import { ReportDetailRow } from "./reportDetailRow";
import styles from "./reportTable.module.css";

type Props = {
  reports: ReportType[];
  onDelete: (reportId: string) => void;
};

export const ReportTable = ({ reports, onDelete }: Props) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (reportId: string) => {
    setOpenId((prev) => (prev === reportId ? null : reportId));
  };

  return (
    <div className={styles.reportTableContainer}>
      <table className={styles.reportTable}>
        <thead>
          <tr>
            <th>通報日時</th>
            <th>通報者</th>
            <th>通報理由</th>
            <th>投稿内容（プレビュー）</th>
            <th>詳細</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((report) => {
              const isOpen = openId === report.reportId;
              return (
                <Fragment key={report.reportId}>
                  <ReportSummaryRow
                    report={report}
                    isOpen={isOpen}
                    onToggle={() => handleToggle(report.reportId)}
                  />
                  {isOpen && (
                    <ReportDetailRow report={report} onDelete={onDelete} />
                  )}
                </Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className={styles.noData}>
                該当データがありませんでした
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
