import { Link } from "react-router";
import styles from "./header.module.css";
import { paths } from "@/config/paths";

export const Header = () => {
  return (
    <div className={styles.headerContainer}>
      <header className={styles.headerTitle}>Tuna</header>

      <div className={styles.supportContainer}>
        <Link to={paths.help.category.getHref()} className={styles.helpLink}>
          <p>ヘルプ</p>
        </Link>
        <Link
          to={paths.inquiry.inquiry.getHref()}
          className={styles.inquiryLink}
        >
          <p>お問い合わせ</p>
        </Link>
      </div>
    </div>
  );
};
