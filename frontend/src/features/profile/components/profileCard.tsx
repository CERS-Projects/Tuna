import { CiEdit } from "react-icons/ci";
import styles from "./profileCard.module.css";
import { type ProfileData } from "../types/profileTypes";
import { Link } from "react-router";
import { paths } from "@/config/paths";

type ProfileCardProps = ProfileData;

export const ProfileCard = (props: ProfileCardProps) => {
  const { showUserId, userName, iconUrl, follow, follower, introduction } =
    props;
  return (
    <div className={styles.profileCard}>
      <div className={styles.profileCardLeft}>
        {iconUrl && (
          <img
            src={iconUrl}
            className={styles.profileIcon}
            alt={`${userName}のプロフィール画像`}
          />
        )}
      </div>
      <div className={styles.profileCardRight}>
        <Link
          to={paths.app.profile.editProfile.getHref()}
          state={props}
          className={styles.profileNameLink}
          title="プロフィール編集"
        >
          {userName}
          <CiEdit className={styles.editIcon} />
        </Link>
        <small>@{showUserId}</small>
        <p>{introduction}</p>
        <div className={styles.followWrapper}>
          <Link
            to={paths.app.profile.follow.getHref()}
            className={styles.followLink}
            title="フォロー"
          >
            <small>フォロー</small>
            <span>{follow}</span>
          </Link>

          <span className={styles.separator}>/</span>

          <Link
            to={paths.app.profile.follower.getHref()}
            className={styles.followLink}
            title="フォロワー"
          >
            <small>フォロワー</small>
            <span>{follower}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
