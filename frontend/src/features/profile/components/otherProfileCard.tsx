import styles from "./profileCard.module.css";
import { type ProfileData } from "../types/profileTypes";
import { Link } from "react-router";
import { paths } from "@/config/paths";

type OtherProfileCardProps = ProfileData & {
  isFollowing: boolean;
  isFollowedBy: boolean;
  onToggleFollow: () => void;
};

export const OtherProfileCard = ({
  showUserId,
  nickname,
  iconUrl,
  followCount,
  followerCount,
  introduction,
  isFollowing,
  isFollowedBy,
  onToggleFollow,
}: OtherProfileCardProps) => {
  return (
    <div className={styles.profileCard}>
      <div className={styles.profileCardLeft}>
        {iconUrl && (
          <img
            src={iconUrl}
            className={styles.profileIcon}
            alt={`${nickname}のプロフィール画像`}
          />
        )}
      </div>

      <div className={styles.profileCardRight}>
        <div className={styles.headerGroup}>
          <h3>{nickname}</h3>
          {isFollowedBy && (
            <span className={styles.followsYouBadge}>フォローされています</span>
          )}
        </div>

        <small>@{showUserId}</small>

        <p>{introduction}</p>

        <div className={styles.followWrapper}>
          <Link
            to={paths.app.profile.follow.getHref(showUserId)}
            className={styles.followLink}
          >
            <small>フォロー</small>
            <span>{followCount}</span>
          </Link>

          <span className={styles.separator}>/</span>

          <Link
            to={paths.app.profile.follower.getHref(showUserId)}
            className={styles.followLink}
          >
            <small>フォロワー</small>
            <span>{followerCount}</span>
          </Link>
        </div>

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
