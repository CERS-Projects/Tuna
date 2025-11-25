import { Link } from "react-router";
import styles from "./header.module.css";
import { paths } from "@/config/paths";

export const Header = () => {
  return (
    <div className={styles.headerContainer}>
      <header className={styles.headerTitle}>Tuna</header>

      <div className={styles.supportContiner}>
        <Link to={paths.help.category.gethref()} className={styles.helpLink}>
          <p>ヘルプ</p>
        </Link>
        <Link to={paths.inquery.getHref()} className={styles.inqueryLink}>
          <p>お問い合わせ</p>
        </Link>
      </div>
      <header className={styles.header}>Tuna</header>
      <Link to={paths.help.category.getHref()} className={styles.helpIcon}>
        <FaQuestionCircle />
      </Link>
    </div>
  );
};
