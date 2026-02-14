import { NavLink, useParams } from "react-router";
import styles from "./profileTab.module.css";
import { paths } from "@/config/paths";

type ProfileCardTabProps = {
  isMyProfile: boolean;
};

export const ProfileCardTab = ({ isMyProfile }: ProfileCardTabProps) => {
  const { showUserId } = useParams();

  if (!showUserId) return null;
  const navItems = [
    {
      path: paths.app.profile.posts.getHref(showUserId),
      label: "投稿",
      isPrivate: false,
    },
    // {
    //   path: paths.app.profile.responses.getHref(showUserId),
    //   label: "返信",
    //   isPrivate: false,
    // },
    {
      path: paths.app.profile.goods.getHref(showUserId),
      label: "いいね",
      isPrivate: false,
    },
    {
      path: paths.app.profile.bookmarks.getHref(showUserId),
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
          key={item.path}
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
