import styles from "./userInfo.module.css";

type UserInfoProps = {
  userIcon: string;
  userName: string;
  userId: string;
};

export const UserInfo = ({ userIcon, userName, userId }: UserInfoProps) => {
  return (
    <div className={styles.userInfo}>
      <img src={userIcon} alt="User Icon" className={styles.userIcon} />
      <div>
        <div className={styles.userName}>{userName}</div>
        <div className={styles.userId}>@{userId}</div>
      </div>
    </div>
  );
};
