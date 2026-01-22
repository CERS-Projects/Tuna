import { Link } from "react-router";
import { type menuItemType } from "../../types/profileTypes";
import styles from "./menuItem.module.css";
import { IoIosArrowDroprightCircle } from "react-icons/io";

type MenuItemProps = menuItemType;

export const MenuItem = ({ menuName, menuPath, menuIcon, menuLabel }: MenuItemProps) => {
  return (
    <div className={styles.cardWrapper}>
      <Link to={menuPath} className={styles.linkArea}>
        <div className={styles.iconWrapper}>
          {menuIcon}
        </div>
        <div className={styles.textWrapper}>
          <h3 className={styles.title}>{menuName}</h3>
          {menuLabel && <p className={styles.label}>{menuLabel}</p>}
        </div>
        <div className={styles.actionIcon}>
          <IoIosArrowDroprightCircle />
        </div>
      </Link>
    </div>
  );
};