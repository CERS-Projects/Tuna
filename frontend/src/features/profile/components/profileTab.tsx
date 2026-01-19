import { NavLink } from "react-router";
import styles from "./profileTab.module.css";
import { paths } from "@/config/paths";

export const ProfileCardTab = () => {
  const navItems = [
    { path: paths.app.profile.posts.path, label: "投稿" },
    { path: paths.app.profile.responses.path, label: "返信" },
    { path: paths.app.profile.goods.path, label: "いいね" },
    { path: paths.app.profile.bookmarks.path, label: "ブックマーク" },
  ];

  return (
    <nav className={styles.profileTabContainer}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }: { isActive: boolean }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};
