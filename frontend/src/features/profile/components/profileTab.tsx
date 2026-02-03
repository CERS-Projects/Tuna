import { NavLink } from "react-router";
import styles from "./profileTab.module.css";
import { paths } from "@/config/paths";

type ProfileCardTabProps = {
  isMyProfile: boolean;
};

export const ProfileCardTab = ({ isMyProfile }: ProfileCardTabProps) => {
  const navItems = [
    { path: paths.app.profile.posts.path, label: "投稿", isPrivate: false },
    { path: paths.app.profile.responses.path, label: "返信", isPrivate: false },
    { path: paths.app.profile.goods.path, label: "いいね", isPrivate: false },
    {
      path: paths.app.profile.bookmarks.path,
      label: "ブックマーク",
      isPrivate: true,
    },
  ];

  const visibleNavItems = navItems.filter((item) => {
    if (isMyProfile) return true;
    return !item.isPrivate;
  });

  return (
    <nav className={styles.profileTabContainer}>
      {visibleNavItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};
