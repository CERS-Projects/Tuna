import styles from "./followCard.module.css";
import { type FollowData } from "../../types/profileTypes";
import { Link } from "react-router";
import { paths } from "@/config/paths";
import { useDebouncedFollow } from "../../hooks/useFollow";
import { useState } from "react";

type ProfileCardProps = FollowData & { isMyself: boolean };

export const FollowCard = ({
  userId,
  showUserId,
  nickname,
  iconUrl,
  followed,
  following,
  isMyself,
}: ProfileCardProps) => {
  const { debouncedToggle } = useDebouncedFollow(userId, showUserId);
  const [isFollowing, setIsFollowing] = useState<boolean>(following);

  const handleFollow = () => {
    debouncedToggle(isFollowing);
    setIsFollowing((prev) => !prev);
  };

  return (
    <div className={styles.cardContainer}>
      <Link
        to={paths.app.profile.root.getHref(showUserId)}
        className={styles.userInfoLink}
      >
        <div className={styles.iconWrapper}>
          {iconUrl && (
            <img
              src={iconUrl}
              className={styles.profileIcon}
              alt={`${nickname}のプロフィール画像`}
            />
          )}
        </div>
        <div className={styles.textWrapper}>
          <div className={styles.nameRow}>
            <span className={styles.userName}>{nickname}</span>
            {followed && (
              <span className={styles.followedBadge}>フォローされています</span>
            )}
          </div>
          <span className={styles.userId}>@{showUserId}</span>
        </div>
      </Link>

      <div className={styles.actionArea}>
        {!isMyself && (
          <button
            className={
              isFollowing ? styles.buttonFollowing : styles.buttonFollow
            }
            onClick={handleFollow}
          >
            {isFollowing ? "フォロー中" : "フォローする"}
          </button>
        )}
      </div>
    </div>
  );
};
