import { NavLink, Outlet, useLocation, matchPath } from "react-router";
import styles from "./accountShell.module.css";
import { paths } from "@/config/paths";

const AccountShell = () => {
  const location = useLocation();

  return (
    <div className={styles.mainContainer}>
      <h2 className={styles.sectionName}>アカウント管理</h2>

      <div className={styles.outletContainer}>
        <nav className={styles.tabs}>
          <NavLink
            to={paths.app.management.account.list.path}
            className={({ isActive }) => {
              const isRelatedPage = matchPath(
                paths.app.management.account.edit.getHref("*"),
                location.pathname
              );

              return `${styles.tab} ${
                isActive || isRelatedPage ? styles.tabActive : ""
              }`;
            }}
          >
            アカウント情報閲覧
          </NavLink>
          <NavLink
            to={paths.app.management.account.new.path}
            className={({ isActive }) => {
              const relatedPages = [
                paths.app.management.account.register.path,
                paths.app.management.account.import.path,
              ];

              const isRelatedPage = relatedPages.some((path) =>
                location.pathname.startsWith(path)
              );

              return `${styles.tab} ${
                isActive || isRelatedPage ? styles.tabActive : ""
              }`;
            }}
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
