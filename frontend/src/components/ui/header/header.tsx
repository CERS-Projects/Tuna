import { FaQuestionCircle } from "react-icons/fa";
import { Link } from "react-router";
import styles from "./header.module.css";
import { paths } from "@/config/paths";

export const Header = () => {
  return (
    <div className={styles.headerContainer}>
      <header className={styles.header}>Tuna</header>
      <div className={styles.supportContiner}>
        <Link to={paths.help.category.gethref()} className={styles.helpIcon}>
          <FaQuestionCircle />
        </Link>
        <Link to={paths.welcome.getHref()} className={styles.inqueryButton}>
          <a>お問い合わせ</a>
        </Link>
      </div>
    </div>
  );
};
