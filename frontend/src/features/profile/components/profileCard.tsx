import { CiEdit } from "react-icons/ci";
import styles from "./profileCard.module.css";
import { type ProfileData } from "../types/profileTypes";
import { Link } from "react-router";
import { paths } from "@/config/paths";

type ProfileCardProps = ProfileData;

export const ProfileCard = (props: ProfileCardProps) => {
  const {
    showUserId,
    nickname,
    iconUrl,
    followCount,
    followerCount,
    introduction,
  } = props;
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
        <Link
          to={paths.app.profile.edit.getHref(showUserId)}
          state={props}
          className={styles.profileNameLink}
          title="プロフィール編集"
        >
          {nickname}
          <CiEdit className={styles.editIcon} />
        </Link>
        <small>@{showUserId}</small>
        <p>{introduction}</p>
        <div className={styles.followWrapper}>
          <Link
            title="フォロー"
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
            title="フォロワー"
          >
            <small>フォロワー</small>
            <span>{followerCount}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
