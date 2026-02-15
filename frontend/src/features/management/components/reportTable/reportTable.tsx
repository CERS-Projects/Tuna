import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { FaFlag } from "react-icons/fa";
import { MdOutlineArticle } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { type ReportType, reasonLabels } from "../../types/report";
import styles from "./reportTable.module.css";

type Props = {
reports: ReportType[];
onDelete: (reportId: string) => void;
};

const truncateText = (text: string, maxLen: number): string => {
const singleLine = text.replace(/\n/g, " ");
return singleLine.length > maxLen
? singleLine.slice(0, maxLen) + "…"
: singleLine;
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
const reason = reasonLabels[report.reasonId];
const isOpen = openId === report.reportId;

return (
<>
<tr
key={report.reportId}
className={styles.summaryRow}
onClick={() => handleToggle(report.reportId)}
tabIndex={0}
onKeyDown={(e) => {
if (e.key === "Enter") {
e.preventDefault();
handleToggle(report.reportId);
}
}}>
<td style={{ whiteSpace: "pre-line" }}>
{report.reportDate}
</td>
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

{isOpen && (
<tr
key={`${report.reportId}-detail`}
className={styles.detailRow}>
<td colSpan={5}>
<div className={styles.accordion}>
<div className={styles.userInfoHeader}>
<div className={styles.userInfoLeft}>
<span className={styles.userLabel}>
投稿ユーザー
</span>
<span className={styles.userName}>
{report.reportedName}
</span>
<span className={styles.userIdBadge}>
<span className={styles.userIdLabel}>
ユーザID
</span>
<span className={styles.userIdValue}>
{report.reportedShowUserId}
</span>
</span>
</div>
<span className={styles.postDate}>
投稿日時: {report.postDate}
</span>
</div>

<div>
<div className={styles.sectionLabel}>
<FaFlag className={styles.sectionIcon} />
報告内容
</div>
<div className={styles.detailBox}>
{report.reportDetail}
</div>
</div>

<div>
<div className={styles.sectionLabel}>
<MdOutlineArticle
className={styles.sectionIcon}
/>
投稿内容
</div>
<div className={styles.postBox}>
{report.reportedPost}
</div>
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
)}
</>
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
