import { NavLink, useParams } from "react-router";
import styles from "./profileTab.module.css";
import { paths } from "@/config/paths";

type ProfileCardTabProps = {
  isMyProfile: boolean;
};

const generatePath = (pathTemplate: string, userId: string) => {
  return pathTemplate.replace(":userId", userId);
};

export const ProfileCardTab = ({ isMyProfile }: ProfileCardTabProps) => {
  const { userId } = useParams();

  if (!userId) return null;
  const navItems = [
    {
      path: generatePath(paths.app.profile.posts.path, userId),
      label: "投稿",
      isPrivate: false,
    },
    {
      path: generatePath(paths.app.profile.responses.path, userId),
      label: "返信",
      isPrivate: false,
    },
    {
      path: generatePath(paths.app.profile.goods.path, userId),
      label: "いいね",
      isPrivate: false,
    },
    {
      path: generatePath(paths.app.profile.bookmarks.path, userId),
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
