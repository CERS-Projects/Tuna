import { CiEdit } from "react-icons/ci";
import styles from "./profileCard.module.css";
import { type ProfileData } from "../types/profileTypes";
import { Link } from "react-router";

type ProfileCardProps = ProfileData;

export const ProfileCard = ({
  showUserId,
  userName,
  iconUrl,
  follow,
  follower,
  introduction,
}: ProfileCardProps) => {
  return (
    <div className={styles.profileCard}>
      <div className={styles.profileCardLeft}>
        {iconUrl && (
          <img
            src={iconUrl}
            className={styles.profileIcon}
            alt="${userName}のプロフィール画像"
          />
        )}
      </div>
      <div className={styles.profileCardRight}>
        <h3>
          {userName}
          <CiEdit className={styles.iconStyle} />
        </h3>
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
      </div>
    </div>
  );
};
