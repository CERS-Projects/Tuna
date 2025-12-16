import styles from "./menuDrawer.module.css";
import {
  MdGroups,
  MdMeetingRoom,
  MdManageAccounts,
  MdWarning,
} from "react-icons/md";
import { FaComments, FaBell, FaSchool } from "react-icons/fa6";
import { NavLink } from "react-router";
import { paths } from "@/config/paths";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const MENU_ITEMS = [
  {
    path: paths.app.management.group.path,
    name: "グループ管理",
    icon: <MdGroups />,
  },
  {
    path: paths.app.management.post.path,
    name: "投稿管理",
    icon: <FaComments />,
  },
  {
    path: paths.app.management.classroom.path,
    name: "授業ルーム管理",
    icon: <MdMeetingRoom />,
  },
  {
    path: paths.app.management.notification.path,
    name: "お知らせ管理",
    icon: <FaBell />,
  },
  {
    path: paths.app.management.account.path,
    name: "アカウント管理",
    icon: <MdManageAccounts />,
  },
  {
    path: paths.app.management.report.path,
    name: "通報管理",
    icon: <MdWarning />,
  },
];

export const MenuDrawer = ({ isOpen, onClose }: Props) => {
  const role = "ADMIN";

  if (isOpen) {
    return (
      <aside className={styles.drawer}>
        <nav className={styles.navList}>
          {MENU_ITEMS.map((item) => (
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                !isActive
                  ? styles.navCard
                  : `${styles.navCard} ${styles.active}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <div className={styles.navDescription}>
                <h3>{item.name}</h3>
              </div>
            </NavLink>
          ))}

          {role === "ADMIN" && (
            <NavLink
              to={paths.app.management.schoolInfo.path}
              className={({ isActive }) =>
                !isActive
                  ? styles.navCard
                  : `${styles.navCard} ${styles.active}`
              }
            >
              <FaSchool className={styles.navIcon} />
              <div className={styles.navDescription}>
                <h3>学校情報管理</h3>
              </div>
            </NavLink>
          )}
        </nav>
      </aside>
    );
  } else {
    return null;
  }
};
