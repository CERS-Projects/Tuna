import styles from "./responseTo.module.css";
import { type PostData } from "../../types/post";

type ResponseToProps = {
  responseTo: PostData;
};

export const ResponseTo = ({ responseTo }: ResponseToProps) => {
  return (
    <div className={styles.responseToContainer}>
      <div className={styles.responseToHeader}>
        {responseTo.icon && (
          <img src={responseTo.icon} className={styles.responseToIcon} alt="" />
        )}
        <span className={styles.responseToName}>
          {responseTo.nickname}
          <span className={styles.responseToUserId}>
            @{responseTo.showUserId}
          </span>
        </span>
      </div>
      <p className={styles.responseToSentence}>{responseTo.sentence}</p>
      {responseTo.imageUrl && responseTo.imageUrl.length > 0 && (
        <div className={styles.responseToImages}>
          {responseTo.imageUrl.map((url, index) => (
            <img
              key={index}
              src={url}
              className={styles.responseToImage}
              alt=""
            />
          ))}
        </div>
      )}
      <div className={styles.responseingTo}>
        返信先:{" "}
        <span className={styles.responseingToUser}>
          @{responseTo.showUserId}
        </span>
      </div>
    </div>
  );
};
