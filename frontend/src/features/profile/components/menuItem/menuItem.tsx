import { Link } from "react-router";
import { type MenuItemType } from "../../types/profileTypes";
import styles from "./menuItem.module.css";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { paths } from "@/config/paths";

type MenuItemProps = MenuItemType & { handleLogout?: () => void };

export const MenuItem = ({
  menuName,
  menuPath = paths.app.profile.setting.path,
  menuIcon,
  menuLabel,
  handleLogout,
}: MenuItemProps) => {
  const content = (
    <>
      <div className={styles.iconWrapper}>{menuIcon}</div>
      <div className={styles.textWrapper}>
        <h3 className={styles.title}>{menuName}</h3>
        {menuLabel && <p className={styles.label}>{menuLabel}</p>}
      </div>
      <div className={styles.actionIcon}>
        <IoIosArrowDroprightCircle />
      </div>
    </>
  );

  return (
    <div className={styles.cardWrapper}>
      {handleLogout ? (
        <div
          className={styles.linkArea}
          role="button"
          tabIndex={0}
          onClick={handleLogout}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleLogout();
          }}
        >
          {content}
        </div>
      ) : (
        <Link to={menuPath} className={styles.linkArea}>
          {content}
        </Link>
      )}
    </div>
  );
};
