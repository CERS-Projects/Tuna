import type { NoticeType } from "@/features/profile/types/notice";
import styles from "./noticeInfo.module.css";

type NoticeInfoProps = {
  notices: NoticeType[];
};

export const NoticeInfo = ({ notices }: NoticeInfoProps) => {
  return (
    <div className={styles.noticeInfoContainer}>
      <h2>あなたへのお知らせ</h2>
      <hr className={styles.separator} />
      <div className={styles.scrollArea}>
        {notices.map((item) => (
          <div key={item.noticeId} className={styles.noticeInfoContent}>
            <h3>{item.title}</h3>
            <small>
              {new Intl.DateTimeFormat("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(item.createdAt))}
            </small>
            <p>{item.content}</p>
            <big>{item.groupName}</big>
          </div>
        ))}
      </div>
    </div>
  );
};
