import { IoChevronDown } from "react-icons/io5";
import { type ReportType, reasonLabels } from "../../types/report";
import styles from "./reportTable.module.css";

type Props = {
  report: ReportType;
  isOpen: boolean;
  onToggle: () => void;
};

const truncateText = (text: string, maxLen: number): string => {
  const singleLine = text.replace(/\n/g, " ");
  return singleLine.length > maxLen
    ? singleLine.slice(0, maxLen) + "…"
    : singleLine;
};

export const ReportSummaryRow = ({ report, isOpen, onToggle }: Props) => {
  const reason = reasonLabels[report.reasonId];

  return (
    <tr
      className={styles.summaryRow}
      onClick={onToggle}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onToggle();
        }
      }}>
      <td style={{ whiteSpace: "pre-line" }}>{report.reportDate}</td>
      <td>{report.reportByName}</td>
      <td>
        <span
          className={styles.badge}
          style={{
            backgroundColor: reason?.color || "#f1f5f9",
            color: reason?.textColor || "#333",
            borderColor: reason?.color || "#cbd5e1",
          }}>
          {reason?.label || "その他"}
        </span>
      </td>
      <td>{truncateText(report.reportedPost, 30)}</td>
      <td>
        <span
          className={`${styles.toggleIcon} ${isOpen ? styles.toggleIconOpen : ""}`}>
          <IoChevronDown />
        </span>
      </td>
    </tr>
  );
};
