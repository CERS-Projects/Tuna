import { Link, useNavigate, useLocation } from "react-router"; // useLocationを追加
import styles from "./header.module.css";
import { paths } from "@/config/paths";
import { IoArrowBackCircleOutline } from "react-icons/io5";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handlePageBack = () => {
    navigate(-1);
  };

  const handleTitleClick = () => {
    const isProtectedRoute =
      location.pathname.startsWith(paths.app.root.path) ||
      location.pathname.startsWith(paths.app.management.root.path);

    if (isProtectedRoute) {
      navigate(paths.app.timeline.path);
    } else {
      navigate(paths.welcome.path);
    }
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

      <h1
        className={styles.headerTitle}
        onClick={handleTitleClick}
        style={{ cursor: "pointer" }}
      >
        Tuna
      </h1>

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
