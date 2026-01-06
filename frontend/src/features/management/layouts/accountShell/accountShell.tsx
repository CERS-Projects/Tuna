import { NavLink, Outlet } from "react-router";
import styles from "./accountShell.module.css";
import { paths } from "@/config/paths";

const AccountShell = () => {
  return (
    <div className={styles.mainContainer}>
      <h2 className={styles.sectionName}>アカウント管理</h2>

      <div className={styles.outletContainer}>
        <nav className={styles.tabs}>
          <NavLink
            to={paths.app.management.account.list.path}
            className={({ isActive }) =>
              `${styles.tab} ${isActive ? styles.tabActive : ""}`
            }
          >
            アカウント情報閲覧
          </NavLink>
          <NavLink
            to={paths.app.management.account.new.path}
            className={({ isActive }) =>
              `${styles.tab} ${isActive ? styles.tabActive : ""}`
            }
          >
            新規登録
          </NavLink>
        </nav>

        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AccountShell;
