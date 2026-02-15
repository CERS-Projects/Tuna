import { type Notice } from "@/features/notice/types/notice";
import { Link } from "react-router";
import { type MouseEvent } from "react";
import { FiTrash2, FiClock, FiUsers } from "react-icons/fi";
import styles from "./noticeCard.module.css";
import { paths } from "@/config/paths";

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const NoticeCard = ({
  notice,
  onDelete,
}: {
  notice: Notice;
  onDelete: (id: string) => void;
}) => {
  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    onDelete(notice.noticeId);
  };

  return (
    <Link
      to={paths.app.management.notice.edit.getHref(notice.noticeId)}
      state={{ notice }}
      className={styles.noticeCard}
    >
      <div className={styles.noticeHeader}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className={styles.scopeWrapper}>
            <FiUsers className={styles.scopeIcon} size={14} />
            <span className={styles.scopeText} title={notice.groupName}>
              {notice.groupName}
            </span>
          </div>

          <h3 className={styles.noticeTitle}>{notice.title}</h3>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          className={styles.deleteBtn}
          aria-label="削除"
        >
          <FiTrash2 size={18} />
        </button>
      </div>

      <p className={styles.noticeContent}>{notice.content}</p>

      <div className={styles.noticeFooter}>
        <FiClock className={styles.clockIcon} />
        <span className={styles.noticeDate}>
          {formatDate(notice.createdAt)}
        </span>
      </div>
    </Link>
  );
};
