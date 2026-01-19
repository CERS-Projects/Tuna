import { CiEdit } from "react-icons/ci";
import styles from "./profileCard.module.css";
import type { profileCard } from "../types/profileTypes";
import { Link } from "react-router";

type ProfileCardProps = profileCard;

export const ProfileCard = ({
  userId,
  userName,
  iconUrl,
  follow,
  follower,
  introduction,
}: ProfileCardProps) => {
  return (
    <div className={styles.profileCard}>
      <div className={styles.profileCardLeft}>
        {iconUrl && <img src={iconUrl} className={styles.profileIcon} alt="" />}
      </div>
      <div className={styles.profileCardRight}>
        <h3>
          {userName}
          <CiEdit className={styles.iconStyle} />
        </h3>
        <small>@{userId}</small>
        <p>{introduction}</p>
        <Link href="" className={styles.followLink}>
          <small>フォロー</small>
          <span>{follow}</span>
          <small>フォロワー</small>
          <span>{follower}</span>
        </Link>
      </div>
    </div>
  );
};
