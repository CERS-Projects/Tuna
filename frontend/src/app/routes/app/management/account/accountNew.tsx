import { FaChevronRight, FaRegKeyboard, FaFileCsv } from "react-icons/fa";
import { Link } from "react-router";
import { paths } from "@/config/paths";
import styles from "@/features/management/style/accountNew.module.css";

const AccountNew = () => {
  return (
    <div className={styles.contents}>
      <h3 className={styles.sectionName}>アカウント登録メニュー</h3>

      <div className={styles.menuCardContainer}>
        <Link
          to={paths.app.management.account.register.path}
          className={styles.menuCard}
        >
          <span className={styles.left}>
            <span className={styles.iconWrapper} aria-hidden="true">
              <FaRegKeyboard />
            </span>

            <span className={styles.textWrapper}>
              <span className={styles.label}>手入力アカウント登録</span>
              <span className={styles.description}>
                1件ずつ情報を入力してアカウントを登録する
              </span>
            </span>
          </span>

          <FaChevronRight className={styles.chevron} aria-hidden="true" />
        </Link>

        <Link
          to={paths.app.management.account.import.path}
          className={styles.menuCard}
        >
          <span className={styles.left}>
            <span className={styles.iconWrapper} aria-hidden="true">
              <FaFileCsv />
            </span>

            <span className={styles.textWrapper}>
              <span className={styles.label}>外部ファイルアカウント登録</span>
              <span className={styles.description}>
                CSVファイルからまとめてアカウントを登録する
              </span>
            </span>
          </span>

          <FaChevronRight className={styles.chevron} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};

export default AccountNew;
