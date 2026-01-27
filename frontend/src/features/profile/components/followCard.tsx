import React, { useState } from "react";
import styles from "./followCard.module.css";
import { type FollowData } from "../types/profileTypes";
import { Link } from "react-router";

type ProfileCardProps = FollowData;

export const FollowCard = ({
  userId,
  showUserId,
  userName,
  iconUrl,
  isFollowed,
  isFollowing: initialIsFollowing,
}: ProfileCardProps) => {
  const [following, setFollowing] = useState(initialIsFollowing);

  const handleFollowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setFollowing(!following);
  };

  return (
    <div className={styles.cardContainer}>
      <Link to={""} className={styles.userInfoLink}>
        <div className={styles.iconWrapper}>
          {iconUrl && (
            <img
              src={iconUrl}
              className={styles.profileIcon}
              alt={`${userName}のプロフィール画像`}
            />
          )}
        </div>
        <div className={styles.textWrapper}>
          <div className={styles.nameRow}>
            <span className={styles.userName}>{userName}</span>
            {isFollowed && (
              <span className={styles.followedBadge}>フォローされています</span>
            )}
          </div>
          <span className={styles.userId}>@{showUserId}</span>
        </div>
      </Link>

      <div className={styles.actionArea}>
        <button
          className={following ? styles.buttonFollowing : styles.buttonFollow}
          onClick={handleFollowClick}
        >
          {following ? "フォロー中" : "フォローする"}
        </button>
      </div>
    </div>
  );
};
