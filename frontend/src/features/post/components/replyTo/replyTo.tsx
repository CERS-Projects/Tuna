import styles from "./replyTo.module.css";
import { type PostData } from "../../types/post";

type ReplyToProps = {
  replyTo: PostData;
};

export const ReplyTo = ({ replyTo }: ReplyToProps) => {
  return (
    <div className={styles.replyToContainer}>
      <div className={styles.replyToHeader}>
        {replyTo.icon && (
          <img src={replyTo.icon} className={styles.replyToIcon} alt="" />
        )}
        <span className={styles.replyToName}>
          {replyTo.nickname}
          <span className={styles.replyToUserId}>@{replyTo.showUserId}</span>
        </span>
      </div>
      <p className={styles.replyToSentence}>{replyTo.sentence}</p>
      {replyTo.imageUrl && replyTo.imageUrl.length > 0 && (
        <div className={styles.replyToImages}>
          {replyTo.imageUrl.map((url, index) => (
            <img key={index} src={url} className={styles.replyToImage} alt="" />
          ))}
        </div>
      )}
      <div className={styles.replyingTo}>
        返信先:{" "}
        <span className={styles.replyingToUser}>@{replyTo.showUserId}</span>
      </div>
    </div>
  );
};
