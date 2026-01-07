import styles from "./noticeInfo.module.css";

type NoticeInfoItem = {
  noticeId: number;
  groupId: number;
  noticeTitle: string;
  noticeContent: string;
  noticeDate: string;
  teacherName: string;
};

type NoticeInfoProps = {
  items: NoticeInfoItem[];
};

export const NoticeInfo = ({ items }: NoticeInfoProps) => {
  return (
    <div className={styles.noticeInfoContainer}>
      <h2>あなたへのお知らせ</h2>
      <hr className={styles.separator} />
      <div className={styles.scrollArea}>
        {items.map((item) => (
          <div key={item.noticeId} className={styles.noticeInfoContent}>
            <h3>{item.noticeTitle}</h3>
            <small>{item.noticeDate}</small>
            <p>{item.noticeContent}</p>
            <big>{item.teacherName}</big>
          </div>
        ))}
      </div>
    </div>
  );
};
