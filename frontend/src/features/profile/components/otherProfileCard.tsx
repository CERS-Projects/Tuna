import styles from "./profileCard.module.css";
import { type ProfileData } from "../types/profileTypes";
import { Link } from "react-router-dom";

type OtherProfileCardProps = ProfileData & {
  isFollowing: boolean;
  isFollowedBy: boolean;
  onToggleFollow: () => void;
};

export const OtherProfileCard = ({
  showUserId,
  userName,
  iconUrl,
  follow,
  follower,
  introduction,
  isFollowing,
  isFollowedBy,
  onToggleFollow,
}: OtherProfileCardProps) => {
  return (
    <div className={styles.profileCard}>
      {/* 左側：アイコン */}
      <div className={styles.profileCardLeft}>
        {iconUrl && (
          <img
            src={iconUrl}
            className={styles.profileIcon}
            alt={`${userName}のプロフィール画像`}
          />
        )}
      </div>

      {/* 右側：情報 */}
      <div className={styles.profileCardRight}>
        <div className={styles.headerGroup}>
          <h3>{userName}</h3>
          {/* 相手からフォローされている場合の表示 */}
          {isFollowedBy && (
            <span className={styles.followsYouBadge}>フォローされています</span>
          )}
        </div>

        <small>@{showUserId}</small>

        <p>{introduction}</p>

        <div className={styles.followWrapper}>
          <Link to="" className={styles.followLink}>
            <small>フォロー</small>
            <span>{follow}</span>
          </Link>

          <span className={styles.separator}>/</span>

          <Link to="" className={styles.followLink}>
            <small>フォロワー</small>
            <span>{follower}</span>
          </Link>
        </div>

        {/* フォロー切り替えボタン */}
        <button
          className={isFollowing ? styles.followingButton : styles.followButton}
          onClick={onToggleFollow}
        >
          {isFollowing ? "フォロー中" : "フォローする"}
        </button>
      </div>
    </div>
  );
};
