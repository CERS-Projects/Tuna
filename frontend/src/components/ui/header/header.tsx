import { Link } from "react-router";
import styles from "./header.module.css";
import { paths } from "@/config/paths";

export const Header = () => {
  return (
    <header className={styles.headerContainer}>
      <h1 className={styles.headerTitle}>Tuna</h1>

      <div className={styles.supportContainer}>
        <Link to={paths.help.category.getHref()} className={styles.link}>
          <p>ヘルプ</p>
        </Link>
        <Link to={paths.inquiry.inquiry.getHref()} className={styles.link}>
          <p>お問い合わせ</p>
        </Link>
      </div>
    </header>
  );
};
