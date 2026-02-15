import { FaFlag } from "react-icons/fa";
import { MdOutlineArticle } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { ReportType } from "../../types/report";
import styles from "./reportTable.module.css";

type Props = {
  report: ReportType;
  onDelete: (reportId: string) => void;
};

export const ReportDetailRow = ({ report, onDelete }: Props) => {
  return (
    <tr className={styles.detailRow}>
      <td colSpan={5}>
        <div className={styles.accordion}>
          <div className={styles.userInfoHeader}>
            <div className={styles.userInfoLeft}>
              <span className={styles.userLabel}>投稿ユーザー</span>
              <span className={styles.userName}>{report.reportedName}</span>
              <span className={styles.userIdBadge}>
                <span className={styles.userIdLabel}>ユーザID</span>
                <span className={styles.userIdValue}>
                  {report.reportedShowUserId}
                </span>
              </span>
            </div>
            <span className={styles.postDate}>
              投稿日時: {report.reportedPostDate}
            </span>
          </div>

          <div>
            <div className={styles.sectionLabel}>
              <FaFlag className={styles.sectionIcon} />
              報告内容
            </div>
            <div className={styles.detailBox}>{report.reportDetail}</div>
          </div>

          <div>
            <div className={styles.sectionLabel}>
              <MdOutlineArticle className={styles.sectionIcon} />
              投稿内容
            </div>
            <div className={styles.postBox}>{report.reportedPost}</div>
          </div>

          <div className={styles.deleteArea}>
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(report.reportId);
              }}>
              <RiDeleteBin6Line />
              削除
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
};
