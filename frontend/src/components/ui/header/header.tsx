import { Link, useNavigate } from "react-router";
import styles from "./header.module.css";
import { paths } from "@/config/paths";
import { IoArrowBackCircleOutline } from "react-icons/io5";

export const Header = () => {
  const navigate = useNavigate();

  const handlePageBack = () => {
    navigate(-1);
  };

  return (
    <header className={styles.headerContainer}>
      <IoArrowBackCircleOutline
        className={styles.pageBack}
        onClick={handlePageBack}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handlePageBack();
          }
        }}
      />

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
