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
import { useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { decodeUserParams } from "@/features/auth/utils/jwt";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const MENU_ITEMS = [
  {
    path: paths.app.management.group.root.path,
    name: "グループ管理",
    icon: <MdGroups />,
  },
  {
    path: paths.app.management.post.path,
    name: "投稿管理",
    icon: <FaComments />,
  },
  {
    path: paths.app.management.classroom.root.path,
    name: "授業ルーム管理",
    icon: <MdMeetingRoom />,
  },
  {
    path: paths.app.management.notification.path,
    name: "お知らせ管理",
    icon: <FaBell />,
  },
  {
    path: paths.app.management.account.root.path,
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
  const { authToken } = useAuth();
  const userInfo = decodeUserParams(authToken);
  const role = userInfo?.role ?? "STUDENT";

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (isOpen) {
    return (
      <>
        <aside className={styles.drawer}>
          <button
            type="button"
            className={styles.closeDrawer}
            onClick={onClose}
          >
            X
          </button>
          <nav className={styles.navList}>
            {MENU_ITEMS.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={handleLinkClick}
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

            {role === "ADMIN_SCHOOL" && (
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
        <div className={styles.backdrop} onClick={onClose}></div>
      </>
    );
  } else {
    return null;
  }
};
