import { FaEdit, FaUser } from "react-icons/fa";
import styles from "./profileCard.module.css";
import { Link } from "react-router";
import { paths } from "@/config/paths";
import { type User } from "@/types/user";

type ProfileCardProps = User;

export const ProfileCard = (profile: ProfileCardProps) => {
  return (
    <div className={styles.profileCard}>
      <div className={styles.profileCardLeft}>
        {profile.iconUrl ? (
          <img
            src={profile.iconUrl}
            className={styles.profileIcon}
            alt={`${profile.userName}のプロフィール画像`}
          />
        ) : (
          <div className={styles.profileIcon}>
            <FaUser />
          </div>
        )}
      </div>
      <div className={styles.profileCardRight}>
        <Link
          to={paths.app.profile.edit.getHref(profile.showUserId)}
          state={profile}
          className={styles.profileNameLink}
          title="プロフィール編集"
        >
          {profile.userName}
          <FaEdit className={styles.editIcon} />
        </Link>
        <small>@{profile.showUserId}</small>
        <p>{profile.introduction}</p>
        <div className={styles.followWrapper}>
          <Link
            title="フォロー"
            to={paths.app.profile.follow.getHref(profile.showUserId)}
            className={styles.followLink}
          >
            <small>フォロー</small>
            <span>{profile.follow}</span>
          </Link>

          <span className={styles.separator}>/</span>

          <Link
            to={paths.app.profile.follower.getHref(profile.showUserId)}
            className={styles.followLink}
            title="フォロワー"
          >
            <small>フォロワー</small>
            <span>{profile.follower}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
