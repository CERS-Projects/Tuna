import styles from "./profileCard.module.css";
import { FaUser } from "react-icons/fa";
import { type ProfileData } from "../../types/profileTypes";
import { Link } from "react-router";
import { paths } from "@/config/paths";
import { useDebouncedFollow } from "../../hooks/useFollow";
import { useState } from "react";

type OtherProfileCardProps = ProfileData;

export const OtherProfileCard = ({
  userId,
  showUserId,
  nickname,
  iconUrl,
  followCount,
  followerCount,
  introduction,
  isFollowing,
  isFollowed,
}: OtherProfileCardProps) => {
  const { debouncedToggle } = useDebouncedFollow(userId);
  const [isTempFollowing, setIsTempFollowing] = useState<boolean>(isFollowing);

  const handleToggleFollow = () => {
    debouncedToggle(isTempFollowing);
    setIsTempFollowing((prev) => !prev);
  };

  return (
    <div className={styles.otherProfileCard}>
      <div className={styles.profileCardLeft}>
        {iconUrl ? (
          <img
            src={iconUrl}
            className={styles.profileIcon}
            alt={`${nickname}のプロフィール画像`}
          />
        ) : (
          <div className={styles.profileIcon}>
            <FaUser />
          </div>
        )}
      </div>

      <div className={styles.profileCardRight}>
        <div className={styles.headerGroup}>
          <h3>{nickname}</h3>
          {isFollowed && (
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
      </div>

      <div className={styles.followButtonContainer}>
        <button
          className={
            isTempFollowing ? styles.followingButton : styles.followButton
          }
          onClick={handleToggleFollow}
        >
          {isTempFollowing ? "フォロー中" : "フォローする"}
        </button>
      </div>
    </div>
  );
};
